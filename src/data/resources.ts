export interface CareerResource {
  id: string;
  title: string;
  description: string;
  iconName: 'FileText' | 'Video' | 'Brain' | 'Code' | 'Compass' | 'TrendingUp';
  badge: string;
  actionText: string;
  linkHref: string;
  features: string[];
}

export const CAREER_RESOURCES: CareerResource[] = [
  {
    id: 'res-resume',
    title: 'AI-Powered Resume Builder',
    description: 'ATS-optimized templates aligned with Fortune 500 recruitment criteria. Instant keyword scoring and recruiter rubric check.',
    iconName: 'FileText',
    badge: 'Core Toolkit',
    actionText: 'Launch Resume Studio',
    linkHref: '#resources',
    features: ['ATS Keyword Analyzer', 'Role-Specific Bullet Suggestions', 'PDF & LaTeX Export']
  },
  {
    id: 'res-interview',
    title: 'Interview Preparation Hub',
    description: 'Simulate behavioral and situational interviews with real-time feedback on speech cadence, structure, and STAR responses.',
    iconName: 'Video',
    badge: 'Interactive Practice',
    actionText: 'Schedule Mock Interview',
    linkHref: '#resources',
    features: ['STAR Method Framework', 'Domain-Specific Question Banks', 'Alumni Mock Evaluators']
  },
  {
    id: 'res-aptitude',
    title: 'Aptitude & Diagnostic Practice',
    description: 'Timed quantitative, logical reasoning, and verbal assessments designed by corporate campus recruitment benchmarks.',
    iconName: 'Brain',
    badge: 'Assessment Prep',
    actionText: 'Take Practice Test',
    linkHref: '#resources',
    features: ['Adaptive Difficulty Engine', 'Speed & Accuracy Metrics', 'Detailed Video Explanations']
  },
  {
    id: 'res-tech',
    title: 'Technical Preparation Track',
    description: 'Curated problem sets across Data Structures, Algorithms, System Design, SQL, and Object-Oriented Software Architecture.',
    iconName: 'Code',
    badge: 'Engineering & Tech',
    actionText: 'Start Coding Track',
    linkHref: '#resources',
    features: ['Curated LeetCode 150 Roadmaps', 'System Design Whiteboards', 'Live Code Sandbox']
  },
  {
    id: 'res-compass',
    title: 'Career Compass & Roadmaps',
    description: 'Comprehensive guides breaking down career pathways across Cloud, FinTech, Product Management, UI/UX, and Corporate Law.',
    iconName: 'Compass',
    badge: 'Guidance & Pathing',
    actionText: 'Explore Pathways',
    linkHref: '#resources',
    features: ['Skill Prerequisite Trees', 'Salary Benchmarking Data', 'Recommended Certifications']
  },
  {
    id: 'res-insights',
    title: 'Industry Insights & Masterclasses',
    description: 'Exclusive fireside chats, hiring webinars, and masterclasses hosted by CXOs, hiring directors, and RVU alumni.',
    iconName: 'TrendingUp',
    badge: 'Executive Sessions',
    actionText: 'Browse Sessions',
    linkHref: '#resources',
    features: ['Weekly CXO Guest Lectures', 'Recruiter Expectation Deconstructions', 'On-Demand Video Library']
  }
];
