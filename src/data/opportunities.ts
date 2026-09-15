export interface Opportunity {
  id: string;
  title: string;
  company: string;
  category: 'Job' | 'Internship' | 'Placement';
  school: string;
  program: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  matchScore: number;
  compensation: string;
  deadline: string;
  eligibility: string;
  vacancies: number;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  selectionRounds: string[];
  isFeatured?: boolean;
}

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineer - Distributed Systems',
    company: 'Enterprise Tech Partner (Tier 1)',
    category: 'Placement',
    school: 'School of Computer Science & Engineering',
    program: 'B.Tech CSE / Software Engineering',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    matchScore: 92,
    compensation: 'XX LPA (Competitive Full-time)',
    deadline: 'Oct 15, 2026',
    eligibility: 'CGPA 7.5+, No active backlogs, 2026/2027 Graduating Batch',
    vacancies: 18,
    tags: ['Distributed Systems', 'Go / Java', 'Kafka', 'Microservices'],
    description: 'Design and deploy scalable cloud backend systems handling millions of daily transactions within our global cloud infrastructure group.',
    responsibilities: [
      'Architect robust low-latency API services using microservice architectures',
      'Optimize database queries and streaming pipelines using Apache Kafka and Redis',
      'Collaborate with cross-functional engineering teams in agile release sprints'
    ],
    requirements: [
      'Strong grasp of Data Structures, Algorithms, and Object-Oriented Design',
      'Hands-on experience in Java, Go, or C++ with relational database fundamentals',
      'Familiarity with containerization (Docker, Kubernetes) and CI/CD pipelines'
    ],
    selectionRounds: ['Online Technical & Aptitude Assessment', 'Data Structures & Algorithms Round', 'System Architecture & Fitment Round', 'HR Discussion'],
    isFeatured: true
  },
  {
    id: 'opp-2',
    title: 'Quantitative Data Analyst',
    company: 'Global Financial & Analytics Firm',
    category: 'Internship',
    school: 'School of Business & Management',
    program: 'B.Sc / BBA / Dual Degree Analytics',
    location: 'Hyderabad, Telangana',
    workMode: 'Hybrid',
    matchScore: 87,
    compensation: '₹XX,000 / month + PPO Opportunity',
    deadline: 'Oct 22, 2026',
    eligibility: 'Open to Pre-final & Final Year across Analytics, Economics, CSE',
    vacancies: 12,
    tags: ['Python', 'SQL', 'Financial Modeling', 'Tableau'],
    description: 'Synthesize complex market trend data into predictive financial intelligence models for enterprise portfolio managers.',
    responsibilities: [
      'Build automated reporting pipelines utilizing Python, SQL, and PowerBI',
      'Conduct time-series predictive modeling for capital markets evaluation',
      'Present actionable insights directly to quantitative investment strategists'
    ],
    requirements: [
      'Proficiency in SQL data manipulation and Python analytical toolkits (Pandas, NumPy)',
      'Understanding of financial instruments, risk parameters, and statistical hypotheses',
      'Strong analytical presentation and storytelling capabilities'
    ],
    selectionRounds: ['Aptitude & Logical Evaluation', 'Technical Data Case Study', 'Director Round'],
    isFeatured: true
  },
  {
    id: 'opp-3',
    title: 'AI / Machine Learning Research Fellow',
    company: 'NextGen AI Innovation Labs',
    category: 'Placement',
    school: 'School of Computer Science & Engineering',
    program: 'B.Tech / M.Tech AI & Data Science',
    location: 'Bengaluru, Karnataka',
    workMode: 'On-site',
    matchScore: 94,
    compensation: 'XX LPA (Super Dream Band)',
    deadline: 'Nov 05, 2026',
    eligibility: 'CGPA 8.0+ with verified research or repository portfolio',
    vacancies: 6,
    tags: ['Deep Learning', 'PyTorch', 'LLMs', 'Transformer Models'],
    description: 'Engage in state-of-the-art generative modeling, multi-modal foundation models, and synthetic reasoning pipelines.',
    responsibilities: [
      'Train, fine-tune, and evaluate open-weights foundation models and embeddings',
      'Formulate algorithmic benchmarks to test reasoning and context alignment',
      'Author technical research reports and benchmark evaluations'
    ],
    requirements: [
      'Deep mathematical background in Linear Algebra, Probability, and Vector Math',
      'Production familiarity with PyTorch, Hugging Face ecosystem, and CUDA basics',
      'Demonstrated portfolio or open-source PRs in machine learning projects'
    ],
    selectionRounds: ['Coding & Math Diagnostic', 'Research Paper Deconstruction', 'Technical Group Interview'],
    isFeatured: true
  },
  {
    id: 'opp-4',
    title: 'Digital Product Experience Designer',
    company: 'Strategic Design Consultancy',
    category: 'Job',
    school: 'School of Design & Innovation',
    program: 'B.Des / M.Des Product & Interaction Design',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    matchScore: 89,
    compensation: 'XX LPA (Dream Band)',
    deadline: 'Oct 30, 2026',
    eligibility: 'Portfolio submission required, all Design majors eligible',
    vacancies: 8,
    tags: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    description: 'Shape human-centered enterprise web and mobile experiences from conceptual wireframes to high-fidelity design systems.',
    responsibilities: [
      'Conduct generative user interviews and quantitative usability benchmarks',
      'Build modular components conforming to accessible design system tokens',
      'Partner alongside frontend engineers to guarantee pixel-accurate delivery'
    ],
    requirements: [
      'Exemplary portfolio highlighting end-to-end UX/UI problem solving',
      'Mastery of Figma, auto-layout, interactive variants, and token libraries',
      'Strong empathy, communication, and cross-functional facilitation skills'
    ],
    selectionRounds: ['Portfolio Review', 'Whiteboard Design Challenge', 'Culture Fit & Leadership Round'],
    isFeatured: false
  },
  {
    id: 'opp-5',
    title: 'Cloud Infrastructure & DevOps Intern',
    company: 'Enterprise Cloud Solutions Partner',
    category: 'Internship',
    school: 'School of Computer Science & Engineering',
    program: 'B.Tech CSE / IT / Computing',
    location: 'Remote (India)',
    workMode: 'Remote',
    matchScore: 84,
    compensation: '₹XX,000 / month Stipend',
    deadline: 'Nov 12, 2026',
    eligibility: 'Pre-final and final year engineering students',
    vacancies: 15,
    tags: ['AWS / GCP', 'Terraform', 'Docker', 'Linux'],
    description: 'Gain real-world experience implementing Infrastructure-as-Code, observability monitoring, and automated deployment pipelines.',
    responsibilities: [
      'Automate cloud resource provisioning using Terraform scripts',
      'Configure Prometheus and Grafana alerts for microservice uptime',
      'Troubleshoot network routing, VPC peering, and secure secrets management'
    ],
    requirements: [
      'Solid command of Linux shell scripting, networking (TCP/IP, DNS), and Git',
      'Foundational knowledge of AWS or GCP core compute/storage services',
      'Eagerness to explore modern SRE and cloud security patterns'
    ],
    selectionRounds: ['Online Assessment', 'Practical Linux/Networking Task', 'HR Interaction'],
    isFeatured: false
  },
  {
    id: 'opp-6',
    title: 'Legal Technology & Corporate Compliance Analyst',
    company: 'Premier Law & Governance Practice',
    category: 'Placement',
    school: 'School of Law',
    program: 'B.A. LL.B (Hons.) / B.B.A. LL.B (Hons.)',
    location: 'New Delhi / Bengaluru',
    workMode: 'On-site',
    matchScore: 88,
    compensation: 'XX LPA (Core Band)',
    deadline: 'Nov 20, 2026',
    eligibility: 'Final Year Law students with minimum 65% aggregate',
    vacancies: 5,
    tags: ['Contract Intelligence', 'Corporate Governance', 'Data Privacy', 'IP Law'],
    description: 'Bridge legal compliance with automated contract intelligence and digital data privacy regulations for corporate clients.',
    responsibilities: [
      'Review digital software licensing agreements and international privacy frameworks',
      'Draft compliance briefs on AI governance, DPDP Act, and cyber regulations',
      'Support senior advocates in transactional due diligence audits'
    ],
    requirements: [
      'Exemplary legal research and statutory interpretation acumen',
      'Keen interest in emerging tech law, digital ethics, and commercial contracts',
      'Moot court or published legal research credits preferred'
    ],
    selectionRounds: ['Legal Drafting Assessment', 'Subject Matter Viva Voce', 'Partner Interview'],
    isFeatured: false
  }
];
