export interface CareerJourneyStep {
  stepNumber: string;
  title: string;
  description: string;
  ctaText: string;
  route: string;
  category: string;
}

export interface CandidateExcellenceMetric {
  id: string;
  headline: string;
  supportingText: string;
  context: string;
  nature: 'VERIFIED_REPORTING';
  sourceLabel: string;
  sourceUrl: string;
}

export interface PlacementSalaryBand {
  range: string;
  offersEstimate: string;
  percentageNote?: string;
  tierLabel: string;
}

export interface AlumniScholarshipInfo {
  title: string;
  amount: string;
  description: string;
  eligibility: string;
  natureNote: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface VerifiedAlumniProfile {
  id: string;
  name: string;
  programme: string;
  graduationYear: string;
  currentOrganisation?: string;
  role?: string;
  location?: string;
  isVerifiedRVU: boolean;
  verifiedSource?: string;
  sourceUrl?: string;
}

export interface AlumniSectionMeta {
  id: string;
  title: string;
  description: string;
  scope: string;
}

export interface AlumniData {
  sectionHero: {
    eyebrow: string;
    headline: string;
    intro: string;
    subline: string;
  };
  careerJourney: CareerJourneyStep[];
  candidateExcellence: {
    multiOfferMetric: CandidateExcellenceMetric;
    highestCompensationMetric: CandidateExcellenceMetric;
  };
  placementPerformance: {
    reportingCycle: string;
    salaryBands: PlacementSalaryBand[];
    minimumCompensation: string;
    highestCompensation: string;
    totalOffersEstimate: string;
    recruitingOrgsEstimate: string;
    sourceLabel: string;
    sourceUrl: string;
  };
  corporateAlumniRelations: {
    eyebrow: string;
    headline: string;
    supportingText: string;
    scopePoints: string[];
    ctaText: string;
    route: string;
  };
  scholarship: AlumniScholarshipInfo;
  alumniSections: AlumniSectionMeta[];
  verifiedProfiles: VerifiedAlumniProfile[];
  roleConnections: {
    student: {
      label: string;
      ctaText: string;
      route: string;
      description: string;
    };
    alumni: {
      label: string;
      ctaText: string;
      route: string;
      description: string;
    };
    recruiter: {
      label: string;
      ctaText: string;
      route: string;
      description: string;
    };
    management: {
      label: string;
      ctaText: string;
      route: string;
      description: string;
    };
  };
}

export const ALUMNI_CAREER_DATA: AlumniData = {
  sectionHero: {
    eyebrow: 'ALUMNI & CANDIDATE EXCELLENCE',
    headline: 'FROM RVU TO THE WORLD',
    intro: 'From classrooms and industry projects to recruitment and professional life, RVU’s career ecosystem is designed to connect learning with opportunity.',
    subline: 'An interdisciplinary education connected to industry engagement, global academic networks and professional pathways.'
  },
  careerJourney: [
    {
      stepNumber: '01',
      title: 'DISCOVER',
      description: 'Explore disciplines, schools and career possibilities.',
      ctaText: 'Explore Schools',
      route: '/schools',
      category: 'Foundation'
    },
    {
      stepNumber: '02',
      title: 'PREPARE',
      description: 'Build technical, professional and career-readiness skills.',
      ctaText: 'Career Readiness',
      route: '/student/preparation',
      category: 'Development'
    },
    {
      stepNumber: '03',
      title: 'EXPERIENCE',
      description: 'Engage through internships, live projects, mentoring and capstones.',
      ctaText: 'Explore Experiences',
      route: '/opportunities',
      category: 'Experiential'
    },
    {
      stepNumber: '04',
      title: 'CONNECT',
      description: 'Meet recruiters, industry professionals and alumni.',
      ctaText: 'Industry Mentoring',
      route: '/opportunities?type=industry-mentoring',
      category: 'Network'
    },
    {
      stepNumber: '05',
      title: 'LAUNCH',
      description: 'Participate in placement and career opportunities.',
      ctaText: 'Explore Placements',
      route: '/opportunities?type=placement',
      category: 'Recruitment'
    },
    {
      stepNumber: '06',
      title: 'GROW',
      description: 'Continue the journey as an RVU graduate and alumni member.',
      ctaText: 'Alumni Network',
      route: '/alumni',
      category: 'Lifelong'
    }
  ],
  candidateExcellence: {
    multiOfferMetric: {
      id: 'metric-multi-offers',
      headline: 'Approx. 25%',
      supportingText: 'of placed students secured multiple employment offers',
      context: "According to RVU's 2025–26 placement reporting, approximately 25% of placed students secured multiple employment offers.",
      nature: 'VERIFIED_REPORTING',
      sourceLabel: 'RVU 2025–26 Placement Reporting',
      sourceUrl: 'https://rvu.edu.in/placements/'
    },
    highestCompensationMetric: {
      id: 'metric-highest-pkg',
      headline: '₹43.5 LPA',
      supportingText: 'Highest annual compensation reported for 2025–26',
      context: 'Recruiting organization: Aviatrix. Additionally, a second offer of ₹33 LPA was secured from the same organization.',
      nature: 'VERIFIED_REPORTING',
      sourceLabel: 'RVU 2025–26 Placement Reporting',
      sourceUrl: 'https://rvu.edu.in/placements/'
    }
  },
  placementPerformance: {
    reportingCycle: '2025–26 placement reporting',
    salaryBands: [
      {
        range: '₹20–33 LPA',
        offersEstimate: 'Approx. 20 offers',
        percentageNote: 'High-compensation super dream category',
        tierLabel: 'Tier 1 / Super Dream'
      },
      {
        range: '₹10–20 LPA',
        offersEstimate: 'Approx. 40–50 offers',
        percentageNote: 'Core engineering, leadership & dream category',
        tierLabel: 'Dream Tier'
      },
      {
        range: 'Below ₹10 LPA',
        offersEstimate: 'Approx. 80–90 offers',
        percentageNote: 'Foundation recruitment & entry corporate pathways',
        tierLabel: 'Career Foundation'
      }
    ],
    minimumCompensation: 'Approx. ₹4 LPA',
    highestCompensation: '₹43.5 LPA',
    totalOffersEstimate: 'Approx. 425 offers',
    recruitingOrgsEstimate: '250+ organizations',
    sourceLabel: 'Official RV University 2025–26 Placement Reporting',
    sourceUrl: 'https://rvu.edu.in/placements/'
  },
  corporateAlumniRelations: {
    eyebrow: 'CORPORATE & ALUMNI RELATIONS (CAR)',
    headline: "YOUR JOURNEY DOESN'T END AT GRADUATION",
    supportingText: "RVU’s Corporate & Alumni Relations function connects students, industry and alumni as part of the university’s wider career ecosystem.",
    scopePoints: [
      'Facilitating ongoing career mentorship between graduates and enrolled students',
      'Fostering corporate recruitment partnerships and alumni referrals',
      'Sustaining lifelong institutional and professional networking chapters'
    ],
    ctaText: 'Connect with Alumni',
    route: '/alumni'
  },
  scholarship: {
    title: 'RVU ALUMNI SCHOLARSHIP',
    amount: '₹50,000 tuition fee waiver',
    description: "For eligible RVU graduates pursuing a master's programme at RVU.",
    eligibility: 'RVU graduates admitted to RVU postgraduate/master’s degree programmes.',
    natureNote: 'Institutional postgraduate progression scholarship. Separate from undergraduate campus placement compensation.',
    sourceLabel: 'Official RV University Scholarship Guidelines',
    sourceUrl: 'https://rvu.edu.in/rvu-scholarships/'
  },
  alumniSections: [
    {
      id: 'alumni-net',
      title: 'ALUMNI NETWORK',
      description: 'Active professional directory uniting graduates across disciplines and geographies.',
      scope: 'Global & regional chapter connections'
    },
    {
      id: 'alumni-career',
      title: 'CAREER CONNECTIONS',
      description: 'Connecting experienced alumni with emerging career pathways and professional referrals.',
      scope: 'Industry lateral hiring & networking'
    },
    {
      id: 'alumni-mentor',
      title: 'MENTORING',
      description: 'Structured advisory sessions where alumni guide current students through industry realities.',
      scope: 'Portfolio reviews & mock interview prep'
    },
    {
      id: 'alumni-industry',
      title: 'INDUSTRY ENGAGEMENT',
      description: 'Bridging alumni corporate networks with RVU research centres and live student projects.',
      scope: 'Corporate alliances & capstone challenges'
    },
    {
      id: 'alumni-global',
      title: 'GLOBAL COMMUNITY',
      description: 'Connecting graduates pursuing advanced international education or cross-border roles.',
      scope: 'Transnational alumni dialogues'
    },
    {
      id: 'alumni-opps',
      title: 'ALUMNI OPPORTUNITIES',
      description: 'Exclusive leadership roles, executive programs, and campus collaboration opportunities.',
      scope: 'Alumni-focused career opportunities'
    }
  ],
  verifiedProfiles: [],
  roleConnections: {
    student: {
      label: 'FOR CURRENT STUDENTS',
      ctaText: 'Find Alumni Mentors',
      route: '/student/support',
      description: 'Connect with alumni through CAR guidance and career mentoring sessions.'
    },
    alumni: {
      label: 'FOR RVU GRADUATES',
      ctaText: 'Join Alumni Network',
      route: '/alumni/join',
      description: 'Register with Corporate & Alumni Relations and stay connected with campus.'
    },
    recruiter: {
      label: 'FOR TALENT PARTNERS',
      ctaText: 'Connect with RVU Talent',
      route: '/recruiter',
      description: 'Engage with our interdisciplinary undergraduate and postgraduate cohorts.'
    },
    management: {
      label: 'FOR INSTITUTIONAL LEADERS',
      ctaText: 'Manage Alumni Engagement',
      route: '/management/communications',
      description: 'Administer alumni broadcasts, event invitations, and engagement channels.'
    }
  }
};
