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

export const DEMO_OPPORTUNITIES: Opportunity[] = [];
