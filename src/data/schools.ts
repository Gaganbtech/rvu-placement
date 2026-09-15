export interface SchoolInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  careerDomains: string[];
  keyStrengths: string[];
}

export const RVU_OFFICIAL_SCHOOLS: SchoolInfo[] = [
  {
    id: 'so-cse',
    name: 'School of Computer Science and Engineering',
    shortName: 'CSE',
    description: 'Empowering software architects, systems engineers, and AI specialists through state-of-the-art computational laboratories and experiential engineering.',
    careerDomains: ['Technology', 'Software Engineering', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Cloud Infrastructure'],
    keyStrengths: ['Distributed Systems', 'Applied Machine Learning', 'High-Performance Computing']
  },
  {
    id: 'so-design',
    name: 'School of Design and Innovation',
    shortName: 'Design',
    description: 'Fostering human-centric designers who merge creative problem solving with strategic technology to build meaningful products and environments.',
    careerDomains: ['User Experience (UX)', 'Product Design', 'Interaction Design', 'Creative Technology', 'Spatial Design'],
    keyStrengths: ['Design Thinking', 'Prototyping Labs', 'Human-Computer Interaction']
  },
  {
    id: 'so-business',
    name: 'School of Business',
    shortName: 'Business',
    description: 'Developing forward-thinking business leaders and strategic managers equipped with analytical rigor and entrepreneurial acumen.',
    careerDomains: ['Business Consulting', 'Corporate Finance', 'Strategic Marketing', 'Operations & Supply Chain', 'General Management'],
    keyStrengths: ['Financial Analytics', 'Corporate Strategy', 'Entrepreneurial Incubation']
  },
  {
    id: 'so-economics',
    name: 'School of Economics and Public Policy',
    shortName: 'Economics',
    description: 'Bridging quantitative economic modeling, policy analysis, and governance research for public and private institutions.',
    careerDomains: ['Quantitative Analytics', 'Economic Research', 'Public Policy', 'Development Sector', 'Regulatory Advisory'],
    keyStrengths: ['Econometric Modeling', 'Policy Formulation', 'Market Research']
  },
  {
    id: 'so-liberal-arts',
    name: 'School of Liberal Arts and Sciences',
    shortName: 'Liberal Arts',
    description: 'Cultivating critical inquiry, behavioural analysis, environmental literacy, and communication mastery across multidisciplinary foundations.',
    careerDomains: ['Behavioural Research', 'Psychology & Counselling', 'Environmental Science & Sustainability', 'International Relations', 'Corporate Communications'],
    keyStrengths: ['Critical Analysis', 'Cognitive Psychology', 'Global Affairs']
  },
  {
    id: 'so-law',
    name: 'School of Law',
    shortName: 'Law',
    description: 'Nurturing ethically grounded advocates, legal researchers, and corporate compliance experts with specialization in technology law.',
    careerDomains: ['Corporate Law', 'Cyber Law & Tech Compliance', 'Forensic Sciences & Criminology', 'Intellectual Property (IP)', 'Litigation & Arbitration'],
    keyStrengths: ['Moot Court Clinics', 'Tech Law Specialization', 'Forensic Criminology']
  },
  {
    id: 'so-film-media',
    name: 'School of Film, Media and Creative Arts',
    shortName: 'Film & Media',
    description: 'Training contemporary visual storytellers, filmmakers, and digital media strategists using broadcast-grade production facilities.',
    careerDomains: ['Filmmaking & Production', 'Digital Content Strategy', 'Media Analytics', 'Broadcast Arts', 'Audio-Visual Design'],
    keyStrengths: ['Production Studio Suites', 'Visual Storytelling', 'Media Direction']
  },
  {
    id: 'so-continuing-ed',
    name: 'School for Continuing Education & Professional Studies',
    shortName: 'Continuing Ed',
    description: 'Delivering executive upskilling, lifelong learning certifications, and tailored industry transition tracks for working professionals.',
    careerDomains: ['Executive Leadership', 'Digital Transformation', 'Specialized Certifications', 'Professional Development'],
    keyStrengths: ['Industry Masterclasses', 'Modular Credentials', 'Executive Upskilling']
  },
  {
    id: 'so-health',
    name: 'School of Allied and Healthcare Professions',
    shortName: 'Healthcare',
    description: 'Advancing evidence-based health sciences, clinical diagnostics, and wellness technologies to strengthen modern healthcare ecosystems.',
    careerDomains: ['Clinical Diagnostics', 'Health Technology', 'Public Health Management', 'Wellness & Rehabilitation'],
    keyStrengths: ['Clinical Lab Foundations', 'Health Analytics', 'Interprofessional Care']
  }
];
