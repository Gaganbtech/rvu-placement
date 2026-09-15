export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  matches?: {
    title: string;
    company: string;
    matchScore: number;
    tags: string[];
  }[];
}

export interface AIPromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  response: string;
  matches?: {
    title: string;
    company: string;
    matchScore: number;
    tags: string[];
  }[];
}

export const AI_INITIAL_CONVERSATION: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Which opportunities are best suited for my profile in Distributed Systems and Cloud Computing?',
    timestamp: 'Just now'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: 'Based on your verified coursework in Distributed Systems, Docker containerization, and algorithms, I have evaluated 24 open campus requisitions and matched the top opportunities for your profile:',
    timestamp: 'Just now',
    matches: [
      {
        title: 'Software Engineer - Distributed Systems',
        company: 'Enterprise Tech Partner (Tier 1)',
        matchScore: 92,
        tags: ['Go', 'Kafka', 'Microservices', 'High Concurrency']
      },
      {
        title: 'Cloud Infrastructure & DevOps Intern',
        company: 'Enterprise Cloud Solutions Partner',
        matchScore: 88,
        tags: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD']
      },
      {
        title: 'AI / Machine Learning Research Fellow',
        company: 'NextGen AI Innovation Labs',
        matchScore: 85,
        tags: ['PyTorch', 'Distributed Training', 'Python']
      }
    ]
  }
];

export const AI_PROMPT_SUGGESTIONS: AIPromptSuggestion[] = [
  {
    id: 'prompt-1',
    label: '🎯 Opportunities for CSE',
    prompt: 'Which opportunities are best suited for my profile in Distributed Systems and Cloud Computing?',
    response: 'Based on your verified coursework in Distributed Systems, Docker containerization, and algorithms, I have evaluated 24 open campus requisitions and matched the top opportunities for your profile:',
    matches: [
      {
        title: 'Software Engineer - Distributed Systems',
        company: 'Enterprise Tech Partner (Tier 1)',
        matchScore: 92,
        tags: ['Go', 'Kafka', 'Microservices', 'High Concurrency']
      },
      {
        title: 'Cloud Infrastructure & DevOps Intern',
        company: 'Enterprise Cloud Solutions Partner',
        matchScore: 88,
        tags: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD']
      },
      {
        title: 'AI / Machine Learning Research Fellow',
        company: 'NextGen AI Innovation Labs',
        matchScore: 85,
        tags: ['PyTorch', 'Distributed Training', 'Python']
      }
    ]
  },
  {
    id: 'prompt-2',
    label: '📄 Optimize Resume for ATS',
    prompt: 'How can I optimize my resume for Tier 1 enterprise tech shortlisting?',
    response: 'To increase your resume ATS parse rate above 90% for Tier 1 campus drives:\n1. Quantify impact with metrics (e.g., "Reduced query latency by 35% through Redis caching").\n2. Include core keywords: Distributed Systems, REST APIs, Microservices, CI/CD pipelines.\n3. Keep formatting clean single-column with standard headings (Experience, Projects, Education, Skills).\n\nWould you like me to scan your current draft in the Resume Builder?',
  },
  {
    id: 'prompt-3',
    label: '💼 Recruiter Interview Formats',
    prompt: 'What does the typical campus placement interview process look like at RVU?',
    response: 'RVU campus hiring typically follows a structured 4-phase evaluation:\n• Round 1: Online Diagnostic Assessment (Aptitude + Technical MCQ + Live Coding)\n• Round 2: Technical Problem Solving (Data Structures, Algorithms & System Design)\n• Round 3: Domain / Architectural Deep Dive & Portfolio Review\n• Round 4: Leadership Fitment & HR Discussion\n\nYou can book a simulated mock interview in the Interview Preparation Hub anytime.',
  }
];
