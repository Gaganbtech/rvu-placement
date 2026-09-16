export interface NetworkMetric {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  category: 'REPORTING' | 'ECOSYSTEM';
  sourceLabel: string;
  sourceUrl: string;
}

export interface NetworkCategory {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  route: string;
  isExternal?: boolean;
  categoryTag: string;
}

export interface RecruiterCategory {
  id: string;
  name: string;
  description: string;
  focus: string;
  nature: string;
}

export interface CollaborationType {
  id: string;
  title: string;
  description: string;
  scope: string;
  nature: string;
}

export interface GlobalRegionCollaboration {
  id: string;
  regionName: string;
  countries: string[];
  scope: string;
  highlights: string[];
  verifiedPartners?: string[];
  collaborationNature: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface OfficialSource {
  id: string;
  title: string;
  url: string;
  description: string;
  lastVerified: string;
}

export interface IndustryNetworkData {
  hero: {
    eyebrow: string;
    headline: string;
    supportingText: string;
    subSupportingLine: string;
  };
  metrics: NetworkMetric[];
  categories: NetworkCategory[];
  recruiterCategories: RecruiterCategory[];
  collaborationTypes: CollaborationType[];
  regions: GlobalRegionCollaboration[];
  officialSources: OfficialSource[];
  lastVerified: string;
}

export const INDUSTRY_NETWORK_DATA: IndustryNetworkData = {
  hero: {
    eyebrow: 'INDUSTRY CONNECT',
    headline: 'OUR INDUSTRY NETWORK',
    supportingText: 'Connecting RVU’s multidisciplinary talent with industry, organisations, alumni and global academic networks.',
    subSupportingLine: 'Industry engagement across recruitment, experiential learning, innovation and knowledge exchange.'
  },
  lastVerified: 'March 2025 (Official RVU Placement & Collaboration Documentation)',
  officialSources: [
    {
      id: 'src-placement',
      title: 'RV University Placement Reporting (2025–26)',
      url: 'https://rvu.edu.in/placements/',
      description: 'Official RVU Career and Placement statistics including recruiting organizations, offers count, and compensation metrics.',
      lastVerified: '2025–26 Academic Cycle'
    },
    {
      id: 'src-collaborations',
      title: 'RV University Collaborations & Global Alliances',
      url: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/',
      description: 'Official repository of academic, institutional, and research MoUs across domestic and international institutions.',
      lastVerified: '2025–26'
    },
    {
      id: 'src-admissions',
      title: 'RV University Institutional Profile & Admissions Catalog',
      url: 'https://rvu.edu.in/',
      description: 'Institutional documentation detailing 100+ national and international academic and corporate collaborations.',
      lastVerified: '2025–26'
    }
  ],
  metrics: [
    {
      id: 'metric-recruiters',
      value: '250+',
      label: 'Recruiting Organizations',
      sublabel: 'Engaged across campus drives & talent pipelines',
      category: 'REPORTING',
      sourceLabel: 'RVU Placement Reporting',
      sourceUrl: 'https://rvu.edu.in/placements/'
    },
    {
      id: 'metric-graduates',
      value: '1,600+',
      label: 'Industry-Ready Graduates',
      sublabel: 'Graduating cohort across interdisciplinary schools',
      category: 'REPORTING',
      sourceLabel: 'RVU Placement Reporting',
      sourceUrl: 'https://rvu.edu.in/placements/'
    },
    {
      id: 'metric-offers',
      value: 'Approx. 425',
      label: 'Placement Offers',
      sublabel: 'Recorded for the 2025–26 placement cycle',
      category: 'REPORTING',
      sourceLabel: 'RVU 2025–26 Placement Reporting',
      sourceUrl: 'https://rvu.edu.in/placements/'
    },
    {
      id: 'metric-collaborations',
      value: '100+',
      label: 'National & International Collaborations',
      sublabel: 'Academic, institutional, and research MoUs',
      category: 'ECOSYSTEM',
      sourceLabel: 'Official RVU Admissions & Institutional Data',
      sourceUrl: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/'
    }
  ],
  categories: [
    {
      id: 'cat-recruitment',
      title: 'RECRUITMENT',
      description: 'Organizations engaging with RVU talent through campus recruitment.',
      ctaText: 'Explore Recruitment',
      route: '/opportunities?type=placement',
      categoryTag: 'RECRUITMENT'
    },
    {
      id: 'cat-experiential',
      title: 'EXPERIENTIAL LEARNING',
      description: 'Industry-connected learning through internships, live projects and capstones.',
      ctaText: 'Explore Experiences',
      route: '/opportunities',
      categoryTag: 'INDUSTRY'
    },
    {
      id: 'cat-mentoring',
      title: 'INDUSTRY MENTORING',
      description: 'Connect learning with professionals and industry perspectives.',
      ctaText: 'Explore Mentoring',
      route: '/opportunities?type=industry-mentoring',
      categoryTag: 'INDUSTRY'
    },
    {
      id: 'cat-innovation',
      title: 'INNOVATION & RESEARCH',
      description: 'Industry engagement that strengthens applied knowledge, innovation and research.',
      ctaText: 'Explore Innovation',
      route: '/schools',
      categoryTag: 'ACADEMIC'
    },
    {
      id: 'cat-global',
      title: 'GLOBAL COLLABORATION',
      description: 'Academic and international connections extending learning beyond campus.',
      ctaText: 'Explore Global Network',
      route: '/network/global',
      categoryTag: 'GLOBAL'
    },
    {
      id: 'cat-alumni',
      title: 'ALUMNI',
      description: 'Alumni engagement connecting graduates, students and professional networks.',
      ctaText: 'Explore Alumni',
      route: '/alumni',
      categoryTag: 'ALUMNI'
    }
  ],
  recruiterCategories: [
    {
      id: 'rec-mnc',
      name: 'MNCs',
      description: 'Global organisations engaging with RVU talent.',
      focus: 'Multi-geographic operational scope and international standards',
      nature: 'Direct placement drives, structured graduate programs, and cross-border project exposure'
    },
    {
      id: 'rec-gcc',
      name: 'GCCs',
      description: 'Global Capability Centres participating in the recruitment ecosystem.',
      focus: 'Technology innovation, specialized analytics, cloud operations, and business enablement',
      nature: 'High-impact technical roles and center-of-excellence engineering functions'
    },
    {
      id: 'rec-tech',
      name: 'Technology',
      description: 'Technology-focused employers and industry opportunities.',
      focus: 'Enterprise cloud platforms, AI/ML engineering, product design, and cybersecurity',
      nature: 'Core software engineering, technical consultancy, and full-stack product development'
    },
    {
      id: 'rec-consulting',
      name: 'Consulting',
      description: 'Consulting and advisory opportunities.',
      focus: 'Management consulting, technology advisory, public policy research, and valuation',
      nature: 'Analytical problem-solving, corporate strategy, and client-facing transformation projects'
    },
    {
      id: 'rec-financial',
      name: 'Financial',
      description: 'Financial-sector career pathways.',
      focus: 'Banking operations, investment analytics, fintech architectures, and quantitative risk',
      nature: 'Structured financial analyst roles, compliance engineering, and quantitative models'
    },
    {
      id: 'rec-startups',
      name: 'Startups',
      description: 'Emerging enterprises and entrepreneurial environments.',
      focus: 'Agile innovation, early-stage product development, and rapid execution environments',
      nature: 'High-ownership roles, full-lifecycle product ownership, and venture-backed challenges'
    }
  ],
  collaborationTypes: [
    {
      id: 'collab-academic',
      title: 'ACADEMIC PARTNERSHIPS',
      description: 'Advancing learning and research through collaboration and academic exchange.',
      scope: 'Curriculum co-design, faculty exchange, student mobility, and dual-degree pathways.',
      nature: 'Bilateral institutional agreements'
    },
    {
      id: 'collab-industry',
      title: 'INDUSTRY ENGAGEMENT',
      description: 'Strengthening applied knowledge and innovation through industry collaboration.',
      scope: 'Joint innovation labs, live problem statement capstones, and executive guest lectures.',
      nature: 'Applied R&D and industry MoUs'
    },
    {
      id: 'collab-govt',
      title: 'GOVERNMENT & POLICY',
      description: 'Contributing to public policy and governance through academic expertise and research.',
      scope: 'Policy research briefs, legislative clinics, governance think-tank projects, and advisory inputs.',
      nature: 'Public sector & governance bodies'
    },
    {
      id: 'collab-thinktanks',
      title: 'THINK TANKS & RESEARCH',
      description: 'Expanding interdisciplinary inquiry and thought leadership beyond the university.',
      scope: 'Collaborative whitepapers, international symposiums, and peer-reviewed scholarly output.',
      nature: 'Scholarly institutions & research centers'
    }
  ],
  regions: [
    {
      id: 'reg-usa',
      regionName: 'United States',
      countries: ['United States'],
      scope: 'Academic collaborations, student mobility opportunities, and institutional exchange dialogues.',
      highlights: [
        'Institutional dialogue with Arizona State University (ASU)',
        'Academic alliance with Old Dominion University (ODU), Virginia',
        'International educational pathways and graduate progression frameworks'
      ],
      verifiedPartners: ['Arizona State University (ASU)', 'Old Dominion University (ODU)'],
      collaborationNature: 'Official Academic Exchange & Institutional Collaboration',
      sourceLabel: 'RVU Official Collaborations Directory',
      sourceUrl: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/'
    },
    {
      id: 'reg-uk',
      regionName: 'United Kingdom',
      countries: ['United Kingdom'],
      scope: 'Higher education research collaborations, curriculum benchmarking, and student semester programs.',
      highlights: [
        'Partnership with Teesside University, UK',
        'Academic engagement with Edinburgh Napier University, Scotland',
        'Joint academic initiatives and curriculum alignment'
      ],
      verifiedPartners: ['Teesside University', 'Edinburgh Napier University'],
      collaborationNature: 'Higher Education MoUs & Scholarly Exchange',
      sourceLabel: 'RVU Official Collaborations Directory',
      sourceUrl: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/'
    },
    {
      id: 'reg-europe',
      regionName: 'Europe',
      countries: ['Italy', 'Cyprus', 'Bulgaria', 'Norway', 'Latvia'],
      scope: 'European academic consortium engagements, Erasmus+ dialogues, and interdisciplinary research exchange.',
      highlights: [
        'Academic MoU with University of Siena (Università di Siena), Italy',
        'Collaborative framework in Cyprus with European university institutions',
        'Interdisciplinary scholarly networks across Bulgaria, Norway, and Latvia'
      ],
      verifiedPartners: ['University of Siena (Italy)', 'University Partner (Cyprus)'],
      collaborationNature: 'European Inter-University Academic MoUs',
      sourceLabel: 'RVU Official Collaborations Directory',
      sourceUrl: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/'
    },
    {
      id: 'reg-asia',
      regionName: 'Asia & Southeast Asia',
      countries: ['Thailand', 'Indonesia', 'Philippines'],
      scope: 'Regional Asian university alliances, Southeast Asian academic symposiums, and student collaborative workshops.',
      highlights: [
        'Academic cooperation with Dhurakij Pundit University (DPU), Bangkok, Thailand',
        'Academic linkage with university institutions in Indonesia',
        'Institutional educational dialogues in the Philippines'
      ],
      verifiedPartners: ['Dhurakij Pundit University (DPU), Thailand'],
      collaborationNature: 'Asian Academic Partnership Agreements',
      sourceLabel: 'RVU Official Collaborations Directory',
      sourceUrl: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/'
    },
    {
      id: 'reg-africa',
      regionName: 'Africa',
      countries: ['South Africa'],
      scope: 'Scholarly exchange and collaborative educational initiatives with South African academic partners.',
      highlights: [
        'Academic and research dialogues with university partners in South Africa',
        'Knowledge exchange on emerging market socio-legal and technological contexts'
      ],
      verifiedPartners: ['University Collaborations (South Africa)'],
      collaborationNature: 'Institutional Academic Exchange',
      sourceLabel: 'RVU Official Collaborations Directory',
      sourceUrl: 'https://rvu.edu.in/rvu-at-a-glance/collaborations/'
    }
  ]
};
