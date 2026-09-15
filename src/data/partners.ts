export interface IndustryPartner {
  id: string;
  name: string;
  category: 'Technology' | 'Finance' | 'Consulting' | 'Healthcare' | 'Manufacturing' | 'Startups';
  tier: 'Tier 1 Global' | 'Fortune 500' | 'Unicorn' | 'R&D Leader';
  hiringDomains: string[];
  engagementType: 'Campus Recruitment' | 'PPO & Internship' | 'Joint R&D Labs' | 'Executive Mentorship';
}

export const PARTNER_CATEGORIES = [
  'All',
  'Technology',
  'Finance',
  'Consulting',
  'Healthcare',
  'Manufacturing',
  'Startups'
] as const;

export const INDUSTRY_PARTNERS: IndustryPartner[] = [
  {
    id: 'partner-1',
    name: 'Industry Partner - Global Cloud & AI Leader',
    category: 'Technology',
    tier: 'Tier 1 Global',
    hiringDomains: ['Cloud Architecture', 'Distributed Systems', 'Applied AI'],
    engagementType: 'Campus Recruitment'
  },
  {
    id: 'partner-2',
    name: 'Industry Partner - Tier 1 Investment Bank',
    category: 'Finance',
    tier: 'Fortune 500',
    hiringDomains: ['Quantitative Analysis', 'Risk Systems', 'Algorithmic Trading'],
    engagementType: 'PPO & Internship'
  },
  {
    id: 'partner-3',
    name: 'Industry Partner - Global Management Consultancy',
    category: 'Consulting',
    tier: 'Tier 1 Global',
    hiringDomains: ['Business Analytics', 'Strategy', 'Digital Transformation'],
    engagementType: 'Campus Recruitment'
  },
  {
    id: 'partner-4',
    name: 'Industry Partner - Semiconductor & Embedded Systems',
    category: 'Technology',
    tier: 'Fortune 500',
    hiringDomains: ['VLSI Design', 'Edge Computing', 'Firmware Engineering'],
    engagementType: 'Joint R&D Labs'
  },
  {
    id: 'partner-5',
    name: 'Industry Partner - FinTech & Payments Unicorn',
    category: 'Startups',
    tier: 'Unicorn',
    hiringDomains: ['Full Stack Development', 'Product Design', 'Growth Strategy'],
    engagementType: 'PPO & Internship'
  },
  {
    id: 'partner-6',
    name: 'Industry Partner - Precision HealthTech R&D',
    category: 'Healthcare',
    tier: 'R&D Leader',
    hiringDomains: ['Bioinformatics', 'Health Analytics', 'Regulatory Tech'],
    engagementType: 'Campus Recruitment'
  },
  {
    id: 'partner-7',
    name: 'Industry Partner - Electric Mobility & Robotics',
    category: 'Manufacturing',
    tier: 'R&D Leader',
    hiringDomains: ['Autonomous Systems', 'Battery Analytics', 'Mechatronics'],
    engagementType: 'Joint R&D Labs'
  },
  {
    id: 'partner-8',
    name: 'Industry Partner - Multi-National Auditing & Tax',
    category: 'Finance',
    tier: 'Fortune 500',
    hiringDomains: ['Corporate Finance', 'Forensic Audit', 'Tax Advisory'],
    engagementType: 'Campus Recruitment'
  },
  {
    id: 'partner-9',
    name: 'Industry Partner - Autonomous AI & Robotics Lab',
    category: 'Startups',
    tier: 'Unicorn',
    hiringDomains: ['Computer Vision', 'Deep Reinforcement Learning', 'Robotics ROS'],
    engagementType: 'Executive Mentorship'
  }
];
