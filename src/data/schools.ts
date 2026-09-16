import { RVU_OFFICIAL_SOURCE_MAP } from './schoolSources';

export type DegreeLevel = 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PH_D' | 'DIPLOMA_CERTIFICATE';

export interface ProgrammeInfo {
  id: string;
  slug: string;
  name: string;
  degreeType: string;
  degreeLevel: DegreeLevel;
  duration: string;
  overview?: string;
  specialisations?: string[];
  eligibility?: string;
  careerRelevance?: string[];
  officialUrl: string;
}

export interface FacultyMember {
  name: string;
  designation: string;
  roleType?: 'DEAN' | 'ASSOCIATE_DEAN' | 'FACULTY' | 'DIRECTOR';
  areasOfExpertise?: string[];
  profileUrl?: string;
}

export interface ResearchCentre {
  name: string;
  focusArea: string;
  description?: string;
  officialUrl?: string;
}

export interface SchoolEvent {
  title: string;
  date: string;
  description: string;
  category?: 'Workshop' | 'Seminar' | 'Conference' | 'Hackathon' | 'Exhibition';
  sourceUrl?: string;
}

export interface LearningExperience {
  title: string;
  description: string;
  type: 'Laboratory' | 'Studio' | 'Experiential' | 'Moot Court' | 'Clinical' | 'Industry Project';
}

export interface SchoolInfo {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  officialWebsite: string;
  officialPages: {
    overview: string;
    programmes?: string;
    faculty?: string;
    research?: string;
    admissions?: string;
    events?: string;
    contact?: string;
  };
  programmes: ProgrammeInfo[];
  specialisations: string[];
  careerDomains: string[];
  keyStrengths: string[];
  leadership: FacultyMember[];
  faculty: FacultyMember[];
  research?: ResearchCentre[];
  collaborations?: string[];
  events?: SchoolEvent[];
  learningExperience?: LearningExperience[];
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  lastVerified: string;
  sourceUrl: string;
  sourceLabel: string;
}

export const RVU_OFFICIAL_SCHOOLS: SchoolInfo[] = [
  {
    id: 'socse',
    slug: 'computer-science-engineering',
    name: 'School of Computer Science and Engineering',
    shortName: 'SoCSE',
    category: 'Engineering & Technology',
    description: 'Empowering future software architects, computational theorists, and AI specialists through state-of-the-art laboratories, high-performance computing, and a "Design Your Own Curriculum" experiential pedagogy.',
    officialWebsite: 'https://socse.rvu.edu.in',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['socse'].pages,
    careerDomains: ['Technology', 'Software Engineering', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Cloud Infrastructure', 'Systems Architecture', 'Fintech'],
    keyStrengths: ['Distributed Computing', 'Applied & Responsible Machine Learning', 'High-Performance Computing Infrastructure'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://socse.rvu.edu.in',
    sourceLabel: 'RV University Official Portal (socse.rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Abdul Sakib Mondal',
        designation: 'Dean of Research, Collaboration Initiatives and Ranking & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Theoretical Computer Science', 'Applied Machine Learning', 'Algorithm Optimization'],
        profileUrl: 'https://rvu.edu.in/faculty/abdul-sakib-mondal/'
      }
    ],
    faculty: [
      {
        name: 'Dr. M. Manimekalai',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Artificial Intelligence', 'Machine Learning', 'Computational Intelligence'],
        profileUrl: 'https://rvu.edu.in/faculty/manimekalai/'
      },
      {
        name: 'Dr. Devaraju R.',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Intelligent Communication Systems', 'Embedded Technologies', 'IoT'],
        profileUrl: 'https://rvu.edu.in/faculty/devaraju-r/'
      },
      {
        name: 'Aashish Khilnani',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Brain-Computer Interfaces', 'Explainable AI', 'Graph Neural Networks'],
        profileUrl: 'https://rvu.edu.in/faculty/aashish-khilnani/'
      },
      {
        name: 'Dr. Tuhin Kumar Maji',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Semiconductor Devices', 'Computational Physics', 'Nanotechnology'],
        profileUrl: 'https://rvu.edu.in/faculty/tuhin-kumar-maji/'
      },
      {
        name: 'Monesh N.',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Data Science', 'Artificial Intelligence', 'Predictive Modeling'],
        profileUrl: 'https://rvu.edu.in/faculty/monesh-n/'
      },
      {
        name: 'Abhishek Dey',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Software Systems', 'Computing Architectures'],
        profileUrl: 'https://rvu.edu.in/faculty/abhishek-dey/'
      },
      {
        name: 'Aishwarya Singh Gautam',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Computer Science Fundamentals', 'Algorithms'],
        profileUrl: 'https://rvu.edu.in/faculty/aishwarya-singh-gautam/'
      }
    ],
    programmes: [
      {
        id: 'socse-btech-cse',
        slug: 'btech-hons-cse',
        name: 'B.Tech. (Hons.) Computer Science and Engineering',
        degreeType: 'B.Tech. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '4 Years (Full-Time)',
        overview: 'A rigorous honours engineering programme focusing on foundational computing systems, algorithmic problem solving, software engineering, and industry-oriented tracks.',
        specialisations: [
          'Artificial Intelligence and Data Science',
          'Fintech & Financial Software Systems',
          'Semiconductor Technology & VLSI',
          'Augmented Reality / Virtual Reality (AR/VR)'
        ],
        eligibility: '10+2 with Physics, Mathematics and Chemistry/CS with minimum specified aggregate, plus valid entrance score (RVU ET / JEE Main / KCET / State CET).',
        careerRelevance: ['Software Engineer', 'Distributed Systems Architect', 'Machine Learning Engineer', 'Cloud Backend Engineer'],
        officialUrl: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#btech-cse'
      },
      {
        id: 'socse-bsc-cs',
        slug: 'bsc-hons-cs',
        name: 'B.Sc. (Hons.) Computer Science',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'An applied computing sciences curriculum designed to develop strong mathematical, theoretical, and algorithmic skills with practical application across scientific domains.',
        specialisations: ['Data Science & Analytics', 'Artificial Intelligence', 'Computational Mathematics'],
        eligibility: '10+2 with Mathematics as a compulsory subject.',
        careerRelevance: ['Data Analyst', 'AI Specialist', 'Research Assistant', 'Computational Scientist'],
        officialUrl: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#bsc-cs'
      },
      {
        id: 'socse-bca-hons',
        slug: 'bca-hons',
        name: 'B.C.A. (Hons.) Software Product Engineering',
        degreeType: 'B.C.A. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Focused on modern application engineering, full-stack web and mobile development, DevOps, and cloud systems implementation.',
        specialisations: ['Software Product Engineering', 'Full Stack Development', 'Cloud & DevOps'],
        eligibility: '10+2 from a recognised board with Mathematics or Computer Applications preferred.',
        careerRelevance: ['Full Stack Developer', 'DevOps Specialist', 'Web Applications Engineer'],
        officialUrl: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#bca'
      },
      {
        id: 'socse-mtech-cse',
        slug: 'mtech-cse',
        name: 'M.Tech. Computer Science and Engineering',
        degreeType: 'M.Tech.',
        degreeLevel: 'POSTGRADUATE',
        duration: '2 Years (Full-Time)',
        overview: 'Advanced postgraduate engineering curriculum diving deep into distributed systems, intelligent algorithms, and large-scale computational infrastructure.',
        specialisations: ['Data Science & Applied AI', 'Scalable Systems & Cloud Architectures'],
        eligibility: 'B.E. / B.Tech. in CSE/IT or relevant discipline with valid GATE/PGCET or RVU ET score.',
        careerRelevance: ['Principal Systems Engineer', 'Research Scientist', 'AI Architect'],
        officialUrl: 'https://rvu.edu.in/school-of-computer-science-and-engineering/#mtech'
      },
      {
        id: 'socse-phd',
        slug: 'phd-cse',
        name: 'Ph.D. in Computer Science and Engineering',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Doctoral research programme cultivating high-impact discoveries in theoretical and applied computational science under faculty supervision.',
        specialisations: ['Explainable AI', 'Distributed Systems', 'Natural Language Processing', 'Edge Computing'],
        eligibility: 'Master’s degree in Engineering/Technology with minimum 55% aggregate or equivalent CGPA.',
        careerRelevance: ['University Professor', 'Senior Research Scientist', 'Industrial R&D Lead'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Artificial Intelligence & Machine Learning',
      'Fintech Systems',
      'Semiconductor Technology',
      'Augmented & Virtual Reality (AR/VR)',
      'Distributed Systems Architecture'
    ],
    research: [
      {
        name: 'Centre for Applied and Responsible AI (CARA)',
        focusArea: 'Responsible & Ethical AI',
        description: 'Focuses on developing ethical, transparent, and socially responsible artificial intelligence systems with real-world deployments.',
        officialUrl: 'https://rvu.edu.in/research/'
      },
      {
        name: 'Dhee Centre for AI and Data Science',
        focusArea: 'Advanced Machine Learning & Big Data',
        description: 'Dedicated to advanced algorithmic research, multimodal data processing, and large-scale predictive modeling.',
        officialUrl: 'https://rvu.edu.in/research/'
      },
      {
        name: 'Centre for Distributed Systems',
        focusArea: 'Scalable Systems & Network Protocols',
        description: 'Investigating high-throughput microservice fabrics, fault-tolerant networks, and decentralized protocols.',
        officialUrl: 'https://rvu.edu.in/research/'
      }
    ],
    collaborations: [
      'Industry advisory panel of leading global technology firms',
      'Academic partnerships with international research universities',
      'Joint innovation hackathons and open-source contributions'
    ],
    learningExperience: [
      {
        title: 'High-Performance Computational Labs',
        description: 'Workstations equipped with modern GPU acceleration for deep learning, scientific simulation, and distributed systems benchmarking.',
        type: 'Laboratory'
      },
      {
        title: '"Design Your Own Curriculum" Framework',
        description: 'Cross-disciplinary minors across Business, Public Policy, and Design paired with core CS disciplines.',
        type: 'Experiential'
      }
    ],
    contact: {
      email: 'socse@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'sodi',
    slug: 'design-innovation',
    name: 'School of Design and Innovation',
    shortName: 'SDI',
    category: 'Design',
    description: 'Fostering human-centric designers who merge creative problem solving with strategic technology to build meaningful products, services, and digital environments.',
    officialWebsite: 'https://rvu.edu.in/school-of-design-and-innovation/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['sodi'].pages,
    careerDomains: ['User Experience (UX)', 'Product Design', 'Interaction Design', 'Creative Technology', 'Spatial Design', 'Communication Design'],
    keyStrengths: ['Human-Centred Design Methodology', 'Rapid Prototyping Studios', 'Interaction & New Media Design'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-design-and-innovation/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Anuradha Chatterjee',
        designation: 'Dean & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Design History & Theory', 'Architectural Humanities', 'Design Pedagogy'],
        profileUrl: 'https://rvu.edu.in/faculty/anuradha-chatterjee/'
      },
      {
        name: 'Rajavel Manoharan',
        designation: 'Associate Dean & Dean in-charge',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Industrial Design', 'Product Architecture', 'Creative Innovation'],
        profileUrl: 'https://rvu.edu.in/faculty/rajavel-manoharan/'
      },
      {
        name: 'Neha Dubey',
        designation: 'Associate Dean',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Visual Communication', 'Design Research'],
        profileUrl: 'https://rvu.edu.in/faculty/neha-dubey/'
      },
      {
        name: 'Vinay M. N.',
        designation: 'Associate Dean',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Spatial Design', 'Environmental Ergonomics'],
        profileUrl: 'https://rvu.edu.in/faculty/vinay-mn/'
      }
    ],
    faculty: [
      {
        name: 'Abhishek Dey',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Digital Product Design', 'User Experience'],
        profileUrl: 'https://rvu.edu.in/faculty/abhishek-dey-design/'
      }
    ],
    programmes: [
      {
        id: 'sodi-bdes',
        slug: 'bdes-hons',
        name: 'B.Des. (Hons.) in Design',
        degreeType: 'B.Des. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '4 Years (Full-Time)',
        overview: 'Comprehensive professional design degree balancing studio practice, critical thinking, digital tools, and human-centred innovation.',
        specialisations: [
          'User Experience (UX) Design',
          'Product Design (Industrial Products, Digital Products, Lifestyle Accessories)',
          'Communication and New Media',
          'Interior Environments',
          'Transdisciplinary Contexts'
        ],
        eligibility: '10+2 in any stream with minimum aggregate, plus score in UCEED / NID-DAT / RVU ET (Design).',
        careerRelevance: ['UX/UI Designer', 'Product Strategist', 'Interaction Designer', 'Visual Brand Designer'],
        officialUrl: 'https://rvu.edu.in/school-of-design-and-innovation/#bdes'
      },
      {
        id: 'sodi-mdes',
        slug: 'mdes',
        name: 'M.Des. (Master of Design)',
        degreeType: 'M.Des.',
        degreeLevel: 'POSTGRADUATE',
        duration: '2 Years (Full-Time)',
        overview: 'Advanced postgraduate design programme focusing on strategic innovation, service design, and multidisciplinary design synthesis.',
        specialisations: ['User Experience (UX)', 'Communication Design', 'Product Design'],
        eligibility: 'Bachelor’s degree in Design, Architecture, Engineering, or relevant discipline with portfolio review.',
        careerRelevance: ['Lead UX Architect', 'Design Researcher', 'Product Innovation Manager'],
        officialUrl: 'https://rvu.edu.in/school-of-design-and-innovation/#mdes'
      },
      {
        id: 'sodi-phd',
        slug: 'phd-design',
        name: 'Ph.D. in Design',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Doctoral research addressing design theory, spatial analysis, social design, and technology interaction paradigms.',
        specialisations: ['Design History & Criticism', 'Design Education', 'Human-Computer Interaction'],
        eligibility: 'Master’s degree in Design, Architecture, or relevant discipline.',
        careerRelevance: ['Design Academic', 'R&D Design Director', 'Design Policy Consultant'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'User Experience (UX) Design',
      'Product & Industrial Design',
      'Communication & New Media',
      'Interior Environments',
      'Transdisciplinary Design'
    ],
    learningExperience: [
      {
        title: 'Design Studios & Making Workshops',
        description: 'Hands-on woodworking, metalworking, clay modeling, and 3D digital fabrication facilities.',
        type: 'Studio'
      },
      {
        title: 'User Testing & Ergonomics Lab',
        description: 'Usability testing setups for digital user interfaces and physical ergonomics assessment.',
        type: 'Laboratory'
      }
    ],
    contact: {
      email: 'sdi@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'sob',
    slug: 'business',
    name: 'School of Business',
    shortName: 'SoB',
    category: 'Business',
    description: 'Developing forward-thinking business leaders and strategic managers equipped with analytical rigor, financial intelligence, and entrepreneurial acumen in an evolving global market.',
    officialWebsite: 'https://rvu.edu.in/school-of-business/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['sob'].pages,
    careerDomains: ['Business Consulting', 'Corporate Finance', 'Strategic Marketing', 'Operations & Supply Chain', 'General Management', 'Investment Banking', 'Business Intelligence'],
    keyStrengths: ['Financial Modeling & Capital Markets', 'Applied Business Analytics', 'Corporate Strategy & Incubation'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-business/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Madhvi Sethi',
        designation: 'Dean & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Financial Accounting', 'Corporate Governance', 'Capital Markets'],
        profileUrl: 'https://rvu.edu.in/faculty/madhvi-sethi/'
      },
      {
        name: 'Prof. Diganta Chakrabarti',
        designation: 'Dean – Academic Affairs & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Human Resource Management', 'Organizational Behaviour'],
        profileUrl: 'https://rvu.edu.in/faculty/diganta-chakrabarti/'
      }
    ],
    faculty: [],
    programmes: [
      {
        id: 'sob-bba-hons',
        slug: 'bba-hons',
        name: 'B.B.A. (Hons.) in Business Administration',
        degreeType: 'B.B.A. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Core business administration curriculum blending management strategy, marketing science, and data-driven decision making.',
        specialisations: [
          'Digital Marketing',
          'Capital Markets',
          'Business Intelligence and Data Analytics',
          'Entrepreneurship & Innovation',
          'Human Resource Management'
        ],
        eligibility: '10+2 from any recognised board with specified minimum marks.',
        careerRelevance: ['Management Trainee', 'Marketing Strategist', 'Financial Analyst', 'Business Development Lead'],
        officialUrl: 'https://rvu.edu.in/school-of-business/#bba'
      },
      {
        id: 'sob-bcom-hons',
        slug: 'bcom-hons',
        name: 'B.Com. (Hons.) in Commerce',
        degreeType: 'B.Com. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Advanced commerce education emphasizing global accounting standards, taxation, corporate finance, and compliance frameworks.',
        specialisations: [
          'International Accounting',
          'Finance and Wealth Management',
          'Banking and Financial Services'
        ],
        eligibility: '10+2 with Commerce, Accountancy, or Mathematics background preferred.',
        careerRelevance: ['Chartered Accountant Aspirant', 'Tax Consultant', 'Auditor', 'Investment Advisor'],
        officialUrl: 'https://rvu.edu.in/school-of-business/#bcom'
      },
      {
        id: 'sob-mba',
        slug: 'mba',
        name: 'M.B.A. (Master of Business Administration)',
        degreeType: 'M.B.A.',
        degreeLevel: 'POSTGRADUATE',
        duration: '2 Years (Full-Time)',
        overview: 'Transformational management education developing analytical decision-makers for leadership roles across corporate and startup ecosystems.',
        specialisations: [
          'Regular MBA (Dual Specialisation)',
          'Global Financial Markets',
          'Artificial Intelligence & Data Sciences in Business'
        ],
        eligibility: 'Bachelor’s degree with minimum 50% marks, plus valid CAT / MAT / XAT / CMAT / RVU ET score.',
        careerRelevance: ['Management Consultant', 'Product Manager', 'Corporate Strategist', 'Investment Banker'],
        officialUrl: 'https://rvu.edu.in/school-of-business/#mba'
      },
      {
        id: 'sob-phd',
        slug: 'phd-management',
        name: 'Ph.D. in Management',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Rigorous doctoral research in financial economics, organizational systems, consumer behaviour, and corporate strategy.',
        specialisations: ['Corporate Strategy', 'Sustainable Finance', 'Organizational Behaviour'],
        eligibility: 'Master’s degree in Business Administration/Commerce with minimum 55% aggregate.',
        careerRelevance: ['Management Professor', 'Corporate R&D Director', 'Economic Policy Analyst'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Digital Marketing & Brand Strategy',
      'Capital Markets & Wealth Management',
      'Business Intelligence & Data Analytics',
      'International Accounting',
      'Global Financial Markets'
    ],
    learningExperience: [
      {
        title: 'Trading & Financial Analytics Terminal',
        description: 'Hands-on exposure to market data analytics, equity research, and financial modeling tools.',
        type: 'Laboratory'
      },
      {
        title: 'RVU Incubation & Entrepreneurship Cell',
        description: 'Mentorship and seed-funding pathways for student-led venture creation and business plan execution.',
        type: 'Experiential'
      }
    ],
    contact: {
      email: 'business@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'sosepp',
    slug: 'economics-public-policy',
    name: 'School of Economics and Public Policy',
    shortName: 'SOSEPP',
    category: 'Economics & Public Policy',
    description: 'Bridging quantitative economic modeling, policy analysis, and governance research to shape evidence-based solutions for national and global socio-economic challenges.',
    officialWebsite: 'https://rvu.edu.in/school-of-economics-and-public-policy/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['sosepp'].pages,
    careerDomains: ['Quantitative Analytics', 'Economic Research', 'Public Policy', 'Development Sector', 'Regulatory Advisory', 'Socio-Economic Consulting'],
    keyStrengths: ['Econometric Analysis & Causal Inference', 'Policy Formulation & Governance', 'Development Economics'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-economics-and-public-policy/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Pushkarni Panchamukhi',
        designation: 'Associate Dean & Professor',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Applied Econometrics', 'Development Economics', 'Public Economics'],
        profileUrl: 'https://rvu.edu.in/faculty/pushkarni-panchamukhi/'
      },
      {
        name: 'Prof. Dwarika Prasad Uniyal',
        designation: 'Pro-Vice Chancellor & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Consumer Behaviour', 'Policy Strategy', 'Public Governance'],
        profileUrl: 'https://rvu.edu.in/faculty/dwarika-prasad-uniyal/'
      }
    ],
    faculty: [],
    programmes: [
      {
        id: 'sosepp-bsc-econ',
        slug: 'bsc-hons-economics',
        name: 'B.Sc. (Hons.) Economics',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Rigorous economics undergraduate degree prioritizing mathematical modeling, econometrics, and public policy applications.',
        specialisations: [
          'Data Analytics in Economics',
          'Development Studies and Public Policy',
          'Financial Economics'
        ],
        eligibility: '10+2 with Mathematics or Economics preferred.',
        careerRelevance: ['Economic Analyst', 'Policy Researcher', 'Data Consultant', 'Central Banking Analyst'],
        officialUrl: 'https://rvu.edu.in/school-of-economics-and-public-policy/#bsc-econ'
      },
      {
        id: 'sosepp-msc-econ',
        slug: 'msc-economics',
        name: 'M.Sc. Economics',
        degreeType: 'M.Sc.',
        degreeLevel: 'POSTGRADUATE',
        duration: '2 Years (Full-Time)',
        overview: 'Advanced quantitative economics focusing on advanced econometric techniques, monetary policy, international trade, and computational economics.',
        specialisations: [
          'Data Analytics',
          'Financial Economics',
          'Development Studies and Public Policy'
        ],
        eligibility: 'Bachelor’s degree with Economics, Mathematics, Statistics, or Commerce with minimum 50% aggregate.',
        careerRelevance: ['Senior Economist', 'Quantitative Strategist', 'Development Economist'],
        officialUrl: 'https://rvu.edu.in/school-of-economics-and-public-policy/#msc-econ'
      },
      {
        id: 'sosepp-ma-policy',
        slug: 'ma-public-policy',
        name: 'M.A. Public Policy and e-Governance',
        degreeType: 'M.A.',
        degreeLevel: 'POSTGRADUATE',
        duration: '2 Years (Full-Time)',
        overview: 'Interdisciplinary policy programme training professionals in legislative drafting, civic technology, digital governance, and developmental policy implementation.',
        specialisations: ['Public Policy Evaluation', 'e-Governance & Digital Public Infrastructure'],
        eligibility: 'Bachelor’s degree in any discipline from a recognised university.',
        careerRelevance: ['Policy Advisor', 'Government Affairs Consultant', 'Think Tank Researcher'],
        officialUrl: 'https://rvu.edu.in/school-of-economics-and-public-policy/#ma-policy'
      },
      {
        id: 'sosepp-phd',
        slug: 'phd-economics',
        name: 'Ph.D. in Economics and Public Policy',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Empirical doctoral research examining macroeconomic stability, policy evaluation, environmental economics, and fiscal federalism.',
        specialisations: ['Macroeconomic Policy', 'Agricultural Economics', 'Behavioral Public Policy'],
        eligibility: 'Master’s degree in Economics, Public Policy, or allied disciplines.',
        careerRelevance: ['Academic Professor', 'Chief Economist', 'Policy Fellow'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Data Analytics in Economics',
      'Development Studies & Public Policy',
      'Financial Economics',
      'e-Governance & Digital Infrastructure'
    ],
    learningExperience: [
      {
        title: 'Policy Simulation & Econometric Lab',
        description: 'Computer lab with specialized statistical software (R, Stata, Python) for empirical policy impact evaluation.',
        type: 'Laboratory'
      }
    ],
    contact: {
      email: 'sosepp@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'solas',
    slug: 'liberal-arts-sciences',
    name: 'School of Liberal Arts and Sciences',
    shortName: 'SoLAS',
    category: 'Liberal Arts & Sciences',
    description: 'Cultivating critical inquiry, behavioural analysis, environmental literacy, and communication mastery across broad multidisciplinary foundations.',
    officialWebsite: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['solas'].pages,
    careerDomains: ['Behavioural Research', 'Psychology & Counselling', 'Environmental Science & Sustainability', 'International Relations', 'Corporate Communications', 'Decision Sciences'],
    keyStrengths: ['Critical Humanities Inquiry', 'Decision Science & Data Analytics', 'Cognitive & Applied Psychology'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Priya Nair',
        designation: 'Dean & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Literature', 'Cultural Studies', 'Liberal Education Pedagogy'],
        profileUrl: 'https://rvu.edu.in/faculty/priya-nair/'
      },
      {
        name: 'Dr. Vijendra Singh',
        designation: 'Associate Dean',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Sciences & Interdisciplinary Studies'],
        profileUrl: 'https://rvu.edu.in/faculty/vijendra-singh/'
      }
    ],
    faculty: [
      {
        name: 'Dr. Keerthi Kishore S.',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Humanities & Social Sciences'],
        profileUrl: 'https://rvu.edu.in/faculty/keerthi-kishore/'
      },
      {
        name: 'Dr. Megha Shrivastava',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Psychology & Mind Sciences'],
        profileUrl: 'https://rvu.edu.in/faculty/megha-shrivastava/'
      },
      {
        name: 'Dr. Amit John Kurien',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Environmental Science & Ecology'],
        profileUrl: 'https://rvu.edu.in/faculty/amit-john-kurien/'
      },
      {
        name: 'Dr. Ananya Mohanty',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Literature & Languages'],
        profileUrl: 'https://rvu.edu.in/faculty/ananya-mohanty/'
      },
      {
        name: 'Dr. Aswathi A. Nair',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Philosophy and Ethics'],
        profileUrl: 'https://rvu.edu.in/faculty/aswathi-nair/'
      }
    ],
    programmes: [
      {
        id: 'solas-ba-hons',
        slug: 'ba-hons-liberal-arts',
        name: 'B.A. (Hons.) in Liberal Arts',
        degreeType: 'B.A. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Multidisciplinary liberal education offering student-chosen majors across literature, political science, history, philosophy, and creative expression.',
        specialisations: [
          'Film Studies',
          'Performing Arts',
          'History & Indology',
          'Philosophy and Ethics',
          'Literature and Languages',
          'Political Science and Leadership Studies'
        ],
        eligibility: '10+2 in any stream from a recognised board.',
        careerRelevance: ['Journalist', 'Public Relations Specialist', 'Content Strategist', 'Civil Services Candidate'],
        officialUrl: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/#ba'
      },
      {
        id: 'solas-bsc-hons',
        slug: 'bsc-hons-sciences',
        name: 'B.Sc. (Hons.) in Sciences',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Science education integrating experimental methodology, psychological research, and environmental sustainability studies.',
        specialisations: [
          'Environmental Science & Ecology',
          'Psychology and Mind Sciences',
          'Physics and Filmmaking'
        ],
        eligibility: '10+2 with Science stream preferred for Environmental Science; any stream for Psychology.',
        careerRelevance: ['Psychologist Aspirant', 'Sustainability Officer', 'Environmental Analyst'],
        officialUrl: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/#bsc'
      },
      {
        id: 'solas-bsc-decision',
        slug: 'bsc-hons-decision-sciences',
        name: 'B.Sc. (Hons.) in Decision Sciences',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '4 Years (Industry Partnership with Mu Sigma)',
        overview: 'Specialized 4-year applied decision sciences programme offered in direct partnership with Mu Sigma, blending behavioral science, mathematics, and business decisions.',
        specialisations: ['Decision Intelligence', 'Big Data Problem Solving', 'Behavioral Analytics'],
        eligibility: '10+2 with Mathematics as a compulsory subject.',
        careerRelevance: ['Decision Scientist', 'Business Analytics Associate', 'Data Consultant'],
        officialUrl: 'https://rvu.edu.in/school-of-liberal-arts-and-sciences/#decision-sciences'
      },
      {
        id: 'solas-phd',
        slug: 'phd-liberal-arts',
        name: 'Ph.D. in Liberal Arts and Sciences',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Doctoral inquiry in literature, cognitive psychology, environmental policy, or social sciences.',
        specialisations: ['Cognitive Psychology', 'Cultural Studies', 'Environmental Sustainability'],
        eligibility: 'Master’s degree in relevant Arts/Science disciplines with minimum 55% aggregate.',
        careerRelevance: ['Academic Researcher', 'University Faculty', 'Think Tank Director'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Psychology and Mind Sciences',
      'Environmental Science & Sustainability',
      'Political Science and Leadership Studies',
      'Decision Sciences (Mu Sigma Partnership)',
      'Literature and Languages'
    ],
    collaborations: [
      'Mu Sigma - 4-Year B.Sc. Decision Sciences programme integration'
    ],
    learningExperience: [
      {
        title: 'Psychology Observation & Experimental Lab',
        description: 'Testing tools for cognitive, behavioural, and emotional assessment studies.',
        type: 'Laboratory'
      },
      {
        title: 'Environmental Ecology Fieldwork',
        description: 'Experiential biodiversity audits, ecological testing, and field conservation research.',
        type: 'Experiential'
      }
    ],
    contact: {
      email: 'solas@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'sol',
    slug: 'law',
    name: 'School of Law',
    shortName: 'SoL',
    category: 'Law',
    description: 'Nurturing ethically grounded advocates, legal researchers, and corporate compliance experts with contemporary specialization in technology law, cyber regulation, and forensic sciences.',
    officialWebsite: 'https://rvu.edu.in/school-of-law/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['sol'].pages,
    careerDomains: ['Corporate Law', 'Cyber Law & Tech Compliance', 'Forensic Sciences & Criminology', 'Intellectual Property (IP)', 'Litigation & Arbitration', 'Legal Advisory'],
    keyStrengths: ['Moot Court Society Clinics', 'Technology & Cyber Law Focus', 'Forensic Science Laboratories'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-law/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Sujata Bali',
        designation: 'Dean & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Constitutional Law', 'International Law', 'Legal Theory'],
        profileUrl: 'https://rvu.edu.in/faculty/sujata-bali/'
      },
      {
        name: 'Arpitha H.C.',
        designation: 'Associate Dean',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Commercial Law', 'Judicial Systems'],
        profileUrl: 'https://rvu.edu.in/faculty/arpitha-hc/'
      },
      {
        name: 'Prof. Lakshmi Arya Thathachar',
        designation: 'Professor & Dean – Research',
        roleType: 'DEAN',
        areasOfExpertise: ['Legal Philosophy', 'Research Methodologies', 'Jurisprudence'],
        profileUrl: 'https://rvu.edu.in/faculty/lakshmi-arya-thathachar/'
      }
    ],
    faculty: [
      {
        name: 'Dr. Shailja Beniwal',
        designation: 'Assistant Professor & Programme Director',
        roleType: 'FACULTY',
        areasOfExpertise: ['Criminology', 'Forensic Science', 'Criminal Law'],
        profileUrl: 'https://rvu.edu.in/faculty/shailja-beniwal/'
      },
      {
        name: 'Shantanu Pachauri',
        designation: 'Assistant Professor & Co-Director, Centre for Criminal Justice Studies',
        roleType: 'FACULTY',
        areasOfExpertise: ['Criminal Justice', 'Penology'],
        profileUrl: 'https://rvu.edu.in/faculty/shantanu-pachauri/'
      },
      {
        name: 'Dr. Gurudev Sahil',
        designation: 'Associate Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Intellectual Property Law', 'Corporate Governance'],
        profileUrl: 'https://rvu.edu.in/faculty/gurudev-sahil/'
      }
    ],
    programmes: [
      {
        id: 'sol-ba-llb',
        slug: 'ba-llb-hons',
        name: 'B.A. LL.B. (Hons.) Integrated Law',
        degreeType: 'B.A. LL.B. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '5 Years (Full-Time Integrated)',
        overview: 'Five-year integrated dual degree integrating comprehensive liberal arts disciplines with professional legal education accredited by the Bar Council of India.',
        specialisations: ['Constitutional Law', 'International Trade Law', 'Human Rights Law'],
        eligibility: '10+2 from recognised board with minimum 45% (General) / 40% (SC/ST), plus valid CLAT / LSAT-India / RVU ET score.',
        careerRelevance: ['Litigation Advocate', 'Judicial Officer Candidate', 'Legal Counsel', 'Human Rights Advocate'],
        officialUrl: 'https://rvu.edu.in/school-of-law/#ba-llb'
      },
      {
        id: 'sol-bba-llb',
        slug: 'bba-llb-hons',
        name: 'B.B.A. LL.B. (Hons.) Corporate Law',
        degreeType: 'B.B.A. LL.B. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '5 Years (Full-Time Integrated)',
        overview: 'Five-year integrated degree synergizing business administration, finance, and corporate jurisprudence for corporate legal practice.',
        specialisations: ['Corporate Law', 'Mergers & Acquisitions', 'Banking & Insolvency Law'],
        eligibility: '10+2 with minimum 45% (General) / 40% (SC/ST), plus CLAT / LSAT-India / RVU ET score.',
        careerRelevance: ['Corporate Lawyer', 'In-House Legal Counsel', 'M&A Associate', 'Compliance Officer'],
        officialUrl: 'https://rvu.edu.in/school-of-law/#bba-llb'
      },
      {
        id: 'sol-bsc-criminology',
        slug: 'bsc-hons-criminology-forensic',
        name: 'B.Sc. (Hons.) in Criminology, Cyber Law, and Forensic Sciences',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Pioneering multidisciplinary degree fusing crime scene investigation, forensic digital evidence, forensic psychology, and cyber jurisprudence.',
        specialisations: ['Digital Forensics', 'Cyber Law Compliance', 'Criminal Investigation'],
        eligibility: '10+2 in Science or allied stream from a recognised board.',
        careerRelevance: ['Forensic Science Investigator', 'Cyber Security Compliance Analyst', 'Fraud Investigator'],
        officialUrl: 'https://rvu.edu.in/school-of-law/#bsc-criminology'
      },
      {
        id: 'sol-llm',
        slug: 'llm',
        name: 'LL.M. (Master of Laws)',
        degreeType: 'LL.M.',
        degreeLevel: 'POSTGRADUATE',
        duration: '1 Year (Full-Time)',
        overview: 'Postgraduate legal specialization focusing on contemporary legal frameworks, intellectual property regimes, and digital regulations.',
        specialisations: [
          'Intellectual Property & Technology Law',
          'Corporate & Commercial Law',
          'General LL.M.'
        ],
        eligibility: 'LL.B. degree (3-year or 5-year) from a recognised university with minimum 50% marks.',
        careerRelevance: ['IP Specialist', 'Corporate Legal Head', 'Legal Policy Researcher'],
        officialUrl: 'https://rvu.edu.in/school-of-law/#llm'
      },
      {
        id: 'sol-phd',
        slug: 'phd-law',
        name: 'Ph.D. in Law',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Doctoral research advancing jurisprudential theory, international human rights law, tech regulation, and criminal justice reform.',
        specialisations: ['Technology & AI Law', 'Criminal Jurisprudence', 'Constitutional Governance'],
        eligibility: 'Master’s degree in Law (LL.M.) with minimum 55% aggregate.',
        careerRelevance: ['Law Faculty', 'Senior Legal Policy Fellow', 'Judicial Consultant'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Intellectual Property & Technology Law',
      'Corporate Law & Commercial Transactions',
      'Cyber Law & Digital Evidence',
      'Criminology & Forensic Sciences',
      'Constitutional & Human Rights Law'
    ],
    research: [
      {
        name: 'Centre for Criminal Justice Studies',
        focusArea: 'Criminal Law & Penology Reform',
        description: 'Conducts policy studies on incarceration reforms, forensic evidence admissibility, and victim rights.',
        officialUrl: 'https://rvu.edu.in/research/'
      }
    ],
    learningExperience: [
      {
        title: 'State-of-the-Art Moot Court Hall',
        description: 'Simulated courtroom designed to replicate high court proceedings with audio-visual recording for appellate advocacy practice.',
        type: 'Moot Court'
      },
      {
        title: 'Forensic Science & Fingerprinting Lab',
        description: 'Hands-on training in fingerprint analysis, questioned documents examination, and digital cyber forensics.',
        type: 'Laboratory'
      }
    ],
    contact: {
      email: 'law@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'sofmca',
    slug: 'film-media-creative-arts',
    name: 'School of Film, Media and Creative Arts',
    shortName: 'SoFMCA',
    category: 'Film & Media',
    description: 'Training contemporary visual storytellers, filmmakers, and digital media strategists using broadcast-grade production suites, cinema cameras, and animation workstations.',
    officialWebsite: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['sofmca'].pages,
    careerDomains: ['Filmmaking & Production', 'Digital Content Strategy', 'Media Analytics', 'Broadcast Arts', 'Audio-Visual Design', 'Animation & VFX', 'Screenwriting'],
    keyStrengths: ['Cinema Production Suites', 'Visual Storytelling Pedagogy', 'Interactive Animation & Gaming'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Piyush Roy',
        designation: 'Dean & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Film Studies', 'Aesthetics', 'Cinema Criticism', 'Screen Direction'],
        profileUrl: 'https://rvu.edu.in/faculty/piyush-roy/'
      }
    ],
    faculty: [
      {
        name: 'Anand James Dev',
        designation: 'Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Film Production', 'Cinematography'],
        profileUrl: 'https://rvu.edu.in/faculty/anand-james-dev/'
      },
      {
        name: 'Anurag Mishra',
        designation: 'Assistant Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Media Direction', 'Digital Content Creation'],
        profileUrl: 'https://rvu.edu.in/faculty/anurag-mishra/'
      },
      {
        name: 'Aparajita Neogi',
        designation: 'Assistant Professor & Program Director',
        roleType: 'FACULTY',
        areasOfExpertise: ['Visual FX', 'Animation & Game Design'],
        profileUrl: 'https://rvu.edu.in/faculty/aparajita-neogi/'
      },
      {
        name: 'Arvind Kailasam',
        designation: 'Associate Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Audio-Visual Engineering', 'Post-Production'],
        profileUrl: 'https://rvu.edu.in/faculty/arvind-kailasam/'
      }
    ],
    programmes: [
      {
        id: 'sofmca-bsc-film',
        slug: 'bsc-hons-filmmaking',
        name: 'B.Sc. (Hons.) in Filmmaking',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Comprehensive film production degree providing extensive practical training in directing, cinematography, editing, sound design, and producing.',
        specialisations: ['Direction & Screenwriting', 'Cinematography', 'Editing & Sound Design'],
        eligibility: '10+2 from a recognised board with interest in visual arts, plus creative assessment/interview.',
        careerRelevance: ['Film Director', 'Cinematographer', 'Video Editor', 'Production Coordinator'],
        officialUrl: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#filmmaking'
      },
      {
        id: 'sofmca-bsc-animation',
        slug: 'bsc-hons-animation-vfx',
        name: 'B.Sc. (Hons.) in Animation, Visual FX and Gaming',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Technical and creative degree focused on 3D computer animation, compositing, visual effects pipelines, and game asset production.',
        specialisations: ['3D Character Animation', 'Visual Effects (VFX)', 'Game Environment Design'],
        eligibility: '10+2 in any discipline from a recognised board.',
        careerRelevance: ['3D Animator', 'VFX Compositor', 'Game Designer', 'Technical Artist'],
        officialUrl: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#animation'
      },
      {
        id: 'sofmca-ba-journalism',
        slug: 'ba-hons-media-journalism',
        name: 'B.A. (Hons.) in Media and Journalism',
        degreeType: 'B.A. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (FYUP Framework)',
        overview: 'Modern journalism and digital media curriculum training news gatherers, podcasters, investigative reporters, and media managers.',
        specialisations: ['Digital Journalism', 'Broadcast Media', 'Corporate Communications'],
        eligibility: '10+2 from a recognised board.',
        careerRelevance: ['Broadcast Journalist', 'Multimedia Content Producer', 'PR Communications Manager'],
        officialUrl: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#journalism'
      },
      {
        id: 'sofmca-ba-acting',
        slug: 'ba-acting',
        name: 'B.A. in Acting (Film, TV and OTT)',
        degreeType: 'B.A.',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3 Years (Full-Time)',
        overview: 'Intensive conservatory training covering voice modulation, physical theatre, camera acting, and character embodiment for screen and stage.',
        specialisations: ['Screen Acting', 'Voice & Dialect', 'Method Acting'],
        eligibility: '10+2 with audition and acting aptitude screening.',
        careerRelevance: ['Screen Actor', 'Voice-Over Artist', 'Theatre Performer', 'Acting Coach'],
        officialUrl: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#acting'
      },
      {
        id: 'sofmca-msc-film',
        slug: 'msc-filmmaking',
        name: 'M.Sc. in Film Making',
        degreeType: 'M.Sc.',
        degreeLevel: 'POSTGRADUATE',
        duration: '2 Years (Full-Time)',
        overview: 'Advanced postgraduate studio programme focusing on cinematic aesthetics, independent feature producing, and experimental media storytelling.',
        specialisations: ['Advanced Film Direction', 'Creative Producing'],
        eligibility: 'Bachelor’s degree in any discipline with portfolio or creative showreel review.',
        careerRelevance: ['Independent Filmmaker', 'Executive Producer', 'Creative Director'],
        officialUrl: 'https://rvu.edu.in/school-of-film-media-and-creative-arts/#msc-film'
      },
      {
        id: 'sofmca-phd',
        slug: 'phd-film-media',
        name: 'Ph.D. in Film, Media and Creative Arts',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Doctoral research covering Indian cinema history, visual semiotics, OTT streaming ecosystems, and digital media sociology.',
        specialisations: ['Cinema History & Semiotics', 'New Media Studies'],
        eligibility: 'Master’s degree in Film, Media, Mass Communication, or allied arts.',
        careerRelevance: ['Film Scholar', 'Media Professor', 'Archival Curator'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Filmmaking & Direction',
      'Animation, Visual FX & Game Design',
      'Digital Media & Investigative Journalism',
      'Screen Acting (Film, TV, OTT)'
    ],
    learningExperience: [
      {
        title: 'Broadcast-Grade Sound Recording Studio',
        description: 'Acoustically isolated mixing room with Pro Tools control surfaces, Foley recording, and surround sound mastering.',
        type: 'Studio'
      },
      {
        title: 'Chroma Key Green Screen & Post-Production Suite',
        description: 'High-end color grading monitors, DaVinci Resolve suites, and VFX editing workstations.',
        type: 'Studio'
      }
    ],
    contact: {
      email: 'sofmca@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'sceps',
    slug: 'continuing-education-professional-studies',
    name: 'School for Continuing Education & Professional Studies',
    shortName: 'SCEPS',
    category: 'Continuing Education',
    description: 'Delivering executive upskilling, lifelong learning certifications, and tailored industry transition tracks for working professionals, corporate executives, and adult learners.',
    officialWebsite: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['sceps'].pages,
    careerDomains: ['Executive Leadership', 'Digital Transformation', 'Specialized Certifications', 'Professional Development', 'Corporate Upskilling'],
    keyStrengths: ['Industry-Designed Executive Modules', 'Modular Micro-Credentials', 'Flexible Executive Schedules'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Dr. Dwarika Prasad Uniyal',
        designation: 'Dean & Pro-Vice Chancellor',
        roleType: 'DEAN',
        areasOfExpertise: ['Executive Education', 'Higher Education Strategy', 'Marketing & Retail'],
        profileUrl: 'https://rvu.edu.in/faculty/dwarika-prasad-uniyal/'
      },
      {
        name: 'Dr. Tuhin S. Banerjee',
        designation: 'Associate Dean',
        roleType: 'ASSOCIATE_DEAN',
        areasOfExpertise: ['Continuing Education', 'Professional Development Tracks'],
        profileUrl: 'https://rvu.edu.in/faculty/tuhin-banerjee/'
      }
    ],
    faculty: [],
    programmes: [
      {
        id: 'sceps-pgd-exec',
        slug: 'pgd-executive-management',
        name: 'Postgraduate Diploma in Executive Management',
        degreeType: 'PGD',
        degreeLevel: 'DIPLOMA_CERTIFICATE',
        duration: '1 Year (Hybrid Weekend Format)',
        overview: 'Designed for working managers transitioning to general management and leadership roles, featuring live business case studies.',
        specialisations: ['Strategic Leadership', 'Digital Business Transformation', 'Operations Excellence'],
        eligibility: 'Graduation with minimum 2 years of corporate work experience.',
        careerRelevance: ['Senior Manager', 'Operations Director', 'Business Transformation Lead'],
        officialUrl: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/#programmes'
      },
      {
        id: 'sceps-cert-exec',
        slug: 'executive-certificates',
        name: 'Executive Education & Modular Certifications',
        degreeType: 'Professional Certificate',
        degreeLevel: 'DIPLOMA_CERTIFICATE',
        duration: '3 - 6 Months (Modular)',
        overview: 'Short-format credential programs in specialized industry domains such as AI in Management, ESG & Corporate Sustainability, and Supply Chain Resilience.',
        specialisations: ['AI for Business Executives', 'ESG & Sustainability Leadership', 'Supply Chain Analytics'],
        eligibility: 'Working professionals seeking specialized micro-credentials.',
        careerRelevance: ['Functional Specialist', 'Consultant', 'Project Lead'],
        officialUrl: 'https://rvu.edu.in/school-for-continuing-education-and-professional-studies/#certificates'
      }
    ],
    specialisations: [
      'Executive Leadership & Strategy',
      'Digital Transformation & Applied AI',
      'ESG & Sustainable Business Governance'
    ],
    learningExperience: [
      {
        title: 'Executive Cohort Masterclasses',
        description: 'Blended delivery model with weekend in-person intensives and asynchronous case study discussions.',
        type: 'Experiential'
      }
    ],
    contact: {
      email: 'sceps@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  },
  {
    id: 'soahp',
    slug: 'allied-healthcare-professions',
    name: 'School of Allied and Healthcare Professions',
    shortName: 'SoAHP',
    category: 'Healthcare',
    description: 'Advancing evidence-based health sciences, clinical diagnostics, and patient-centred technologies to strengthen clinical support and modern healthcare delivery ecosystems.',
    officialWebsite: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/',
    officialPages: RVU_OFFICIAL_SOURCE_MAP['soahp'].pages,
    careerDomains: ['Clinical Diagnostics', 'Health Technology', 'Public Health Management', 'Wellness & Rehabilitation', 'Hospital Administration', 'Medical Imaging'],
    keyStrengths: ['Hospital-Affiliated Clinical Rotations', 'State-of-the-Art Diagnostic Instrumentation', 'Patient-Centric Care Training'],
    lastVerified: '2026-09-16',
    sourceUrl: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/',
    sourceLabel: 'RV University Official Portal (rvu.edu.in)',
    leadership: [
      {
        name: 'Prof. Arindam Mitra',
        designation: 'Dean & Professor',
        roleType: 'DEAN',
        areasOfExpertise: ['Microbiology', 'Allied Health Sciences', 'Clinical Biotechnology'],
        profileUrl: 'https://rvu.edu.in/faculty/arindam-mitra/'
      }
    ],
    faculty: [
      {
        name: 'Dr. Shwetal Panchal',
        designation: 'Associate Professor',
        roleType: 'FACULTY',
        areasOfExpertise: ['Healthcare Diagnostics', 'Medical Biochemistry'],
        profileUrl: 'https://rvu.edu.in/faculty/shwetal-panchal/'
      }
    ],
    programmes: [
      {
        id: 'soahp-bsc-mlt',
        slug: 'bsc-hons-medical-laboratory-technology',
        name: 'B.Sc. (Hons.) Medical Laboratory Technology (MLT)',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (Including Clinical Internship)',
        overview: 'Prepares skilled laboratory technologists in clinical pathology, hematology, clinical biochemistry, histopathology, and molecular diagnostics.',
        specialisations: ['Clinical Hematology', 'Molecular Diagnostics', 'Clinical Biochemistry'],
        eligibility: '10+2 with Physics, Chemistry, and Biology (PCB) with minimum specified marks.',
        careerRelevance: ['Medical Laboratory Technologist', 'Clinical Diagnostic Specialist', 'Lab Operations Manager'],
        officialUrl: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/#mlt'
      },
      {
        id: 'soahp-bsc-mit',
        slug: 'bsc-hons-medical-imaging-technology',
        name: 'B.Sc. (Hons.) Medical Imaging Technology (MIT)',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (Including Clinical Internship)',
        overview: 'Specialized training in operating advanced radiological imaging modalities including X-Ray, Computed Tomography (CT), MRI, and Ultrasonography.',
        specialisations: ['Radiographic Imaging', 'CT & MRI Modalities', 'Radiation Safety'],
        eligibility: '10+2 with Physics, Chemistry, and Biology (PCB).',
        careerRelevance: ['Radiologic Technologist', 'MRI / CT Specialist', 'Imaging Systems Application Specialist'],
        officialUrl: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/#mit'
      },
      {
        id: 'soahp-bsc-cct',
        slug: 'bsc-hons-cardiac-care-technology',
        name: 'B.Sc. (Hons.) Cardiac Care Technology',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (Including Clinical Internship)',
        overview: 'Clinical training in non-invasive and invasive cardiac diagnostics, assisting cardiologists in echocardiography, stress testing, and cardiac catheterization laboratories.',
        specialisations: ['Echocardiography', 'Cath Lab Assistance', 'Cardiac Electrophysiology'],
        eligibility: '10+2 with Physics, Chemistry, and Biology (PCB).',
        careerRelevance: ['Cardiac Care Technologist', 'Cath Lab Technologist', 'Echocardiographer'],
        officialUrl: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/#cct'
      },
      {
        id: 'soahp-bsc-at-ott',
        slug: 'bsc-hons-anesthesia-ot-technology',
        name: 'B.Sc. (Hons.) Anesthesia and Operation Theater Technology',
        degreeType: 'B.Sc. (Hons.)',
        degreeLevel: 'UNDERGRADUATE',
        duration: '3/4 Years (Including Clinical Internship)',
        overview: 'Equipping healthcare professionals to manage sterile operating suites, assist anesthesiologists, and handle life-support and patient monitoring equipment.',
        specialisations: ['Anesthesia Equipment Management', 'Surgical Theater Protocols', 'Critical Care Support'],
        eligibility: '10+2 with Physics, Chemistry, and Biology (PCB).',
        careerRelevance: ['Anesthesia Technologist', 'OT Manager', 'Critical Care Equipment Specialist'],
        officialUrl: 'https://rvu.edu.in/school-of-allied-and-healthcare-professions/#ott'
      },
      {
        id: 'soahp-phd',
        slug: 'phd-healthcare',
        name: 'Ph.D. in Allied Healthcare Professions',
        degreeType: 'Ph.D.',
        degreeLevel: 'PH_D',
        duration: '3 - 5 Years',
        overview: 'Doctoral research advancing microbiological resistance studies, diagnostic instrumentation, or public health epidemiologic monitoring.',
        specialisations: ['Clinical Microbiology', 'Diagnostic Biomarkers', 'Public Health Technologies'],
        eligibility: 'Master’s degree in Allied Health Sciences, Medical Biotechnology, or Life Sciences.',
        careerRelevance: ['Clinical Researcher', 'Health Sciences Faculty', 'Hospital Laboratory Director'],
        officialUrl: 'https://rvu.edu.in/phd-admissions/'
      }
    ],
    specialisations: [
      'Medical Laboratory Technology (MLT)',
      'Medical Imaging Technology (MIT)',
      'Cardiac Care Technology (CCT)',
      'Anesthesia and Operation Theater Technology (AOTT)'
    ],
    learningExperience: [
      {
        title: 'Clinical Pathology & Biochemistry Labs',
        description: 'Equipped with semi-automated and automated hematology analyzers, spectrophotometers, and microscopy stations.',
        type: 'Laboratory'
      },
      {
        title: 'Hospital Clinical Rotations',
        description: 'Structured clinical internships in multi-speciality tertiary care hospital partner networks.',
        type: 'Clinical'
      }
    ],
    contact: {
      email: 'soahp@rvu.edu.in',
      location: 'RV Vidyaniketan, Mysuru Road, Bengaluru - 560059'
    }
  }
];
