export interface SuccessStory {
  id: string;
  studentName: string;
  program: string;
  school: string;
  role: string;
  company: string;
  packageTier: string;
  quote: string;
  keySkills: string[];
  year: string;
}

export const STUDENT_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    studentName: 'Student Candidate A (Alumni Batch)',
    program: 'B.Tech in Computer Science & Engineering',
    school: 'School of Computer Science & Engineering',
    role: 'Software Development Engineer',
    company: 'Industry Partner - Global Cloud Tech',
    packageTier: 'Super Dream Band',
    quote: 'RVU helped me transform my theoretical foundations into industry-ready confidence. The specialized system design labs gave me an edge during final rounds.',
    keySkills: ['Distributed Systems', 'Go', 'Kubernetes'],
    year: 'Class of 2025'
  },
  {
    id: 'story-2',
    studentName: 'Student Candidate B (Graduating Batch)',
    program: 'B.Des in Product & Experience Design',
    school: 'School of Design & Innovation',
    role: 'Product Experience Designer',
    company: 'Industry Partner - Global Consultancy',
    packageTier: 'Dream Band',
    quote: 'The interdisciplinary curriculum allowed me to work directly on real-world industry problem statements. The placement cell mentored my portfolio presentation relentlessly.',
    keySkills: ['Design Systems', 'Figma', 'User Research'],
    year: 'Class of 2025'
  },
  {
    id: 'story-3',
    studentName: 'Student Candidate C (Analytics Batch)',
    program: 'B.Sc (Hons.) in Data Science & AI',
    school: 'School of Computer Science & Engineering',
    role: 'Quantitative Risk Analyst',
    company: 'Industry Partner - Global Investment Bank',
    packageTier: 'Super Dream Band',
    quote: 'From mock technical interviews to masterclasses by industry practitioners, RVU’s career ecosystem ensured I was thoroughly prepared for high-stakes evaluations.',
    keySkills: ['Python', 'Statistical Modeling', 'SQL'],
    year: 'Class of 2025'
  },
  {
    id: 'story-4',
    studentName: 'Student Candidate D (Corporate Law)',
    program: 'B.B.A. LL.B (Hons.)',
    school: 'School of Law',
    role: 'Corporate Legal Associate',
    company: 'Industry Partner - Top Tier Law Firm',
    packageTier: 'Core Strategic Band',
    quote: 'The experiential legal clinics and specialized technology law electives gave me direct practical exposure that corporate legal recruiters valued immediately.',
    keySkills: ['Corporate Governance', 'IP Law', 'Contract Tech'],
    year: 'Class of 2025'
  }
];
