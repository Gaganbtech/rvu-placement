import type { PreparationTrack, InterviewPrepQuestion } from './types';

export const OFFICIAL_PREPARATION_TRACKS: PreparationTrack[] = [
  {
    id: 'track-aptitude',
    category: 'APTITUDE',
    title: 'Aptitude & Quantitative Problem Solving',
    description: 'Master quantitative math, logical deduction, data interpretation, and verbal reasoning commonly evaluated in round-one recruiter screenings.',
    iconName: 'Calculator',
    tasksCount: 4,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-apt-1',
        category: 'APTITUDE',
        trackId: 'track-aptitude',
        title: 'Quantitative Foundations: Permutations, Probability & Ratios',
        description: 'Practice high-frequency quantitative problems tested by marquee tech and consulting campus recruiters.',
        estimatedMinutes: 45,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Master conditional probability and Bayes theorem shortcuts',
          'Solve time, speed, distance problems using proportional analysis',
          'Practice speed-calculation techniques for large arithmetic matrices'
        ]
      },
      {
        id: 'task-apt-2',
        category: 'APTITUDE',
        trackId: 'track-aptitude',
        title: 'Logical Reasoning & Constraint Satisfaction Puzzles',
        description: 'Linear and circular arrangement puzzles, family tree deductions, and syllogisms.',
        estimatedMinutes: 40,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Develop step-by-step constraint grids for multi-variable logic games',
          'Solve statement-assumption and critical reasoning problems with zero bias'
        ]
      },
      {
        id: 'task-apt-3',
        category: 'APTITUDE',
        trackId: 'track-aptitude',
        title: 'Data Interpretation: Complex Tables, Bar Graphs & Trend Charts',
        description: 'Analyze multi-axis charts, growth rates, and statistical distributions under strict timed test conditions.',
        estimatedMinutes: 50,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Quick percentage estimation and approximate compounding calculations',
          'Extract actionable conclusions from multi-tiered financial reports'
        ]
      },
      {
        id: 'task-apt-4',
        category: 'APTITUDE',
        trackId: 'track-aptitude',
        title: 'Verbal Comprehension & Grammar Precision',
        description: 'Timed reading comprehension passages, sentence correction, and vocabulary in context.',
        estimatedMinutes: 30,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Skim academic passages for main argument and tone markers',
          'Identify common grammatical errors: parallelism, modifier placement, subject-verb agreement'
        ]
      }
    ]
  },
  {
    id: 'track-technical',
    category: 'TECHNICAL',
    title: 'Data Structures, Algorithms & Systems',
    description: 'Deep technical competencies spanning tree algorithms, dynamic programming, relational databases, and system design.',
    iconName: 'Cpu',
    tasksCount: 4,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-tech-1',
        category: 'TECHNICAL',
        trackId: 'track-technical',
        title: 'Trees & Graph Traversal (DFS, BFS, Dijkstra)',
        description: 'Core graph representations, topological sorting, shortest path algorithms, and cycle detection.',
        estimatedMinutes: 60,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Implement adjacency list representations and recursive DFS patterns',
          'Apply BFS for unweighted shortest paths and level-order traversals',
          'Analyze space and time complexities using Big-O notation'
        ]
      },
      {
        id: 'task-tech-2',
        category: 'TECHNICAL',
        trackId: 'track-technical',
        title: 'Relational Database Design & Index Optimization',
        description: 'Write optimized SQL queries, manage indexing strategies (B-Tree, Hash), and understand ACID transactions.',
        estimatedMinutes: 45,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Formulate complex JOINs, GROUP BY aggregations, and window functions',
          'Explain transaction isolation levels and concurrency control anomalies'
        ]
      },
      {
        id: 'task-tech-3',
        category: 'TECHNICAL',
        trackId: 'track-technical',
        title: 'System Design: Scalability, Caching & Load Balancing',
        description: 'Architecting distributed systems capable of handling 100K+ concurrent requests with horizontal scaling.',
        estimatedMinutes: 75,
        difficulty: 'Advanced',
        isCompleted: false,
        learningPoints: [
          'Design caching layers with Redis/Memcached (write-through vs cache-aside)',
          'Evaluate database sharding, replication, and CAP theorem tradeoffs',
          'Size estimation and throughput bottlenecks for web APIs'
        ]
      },
      {
        id: 'task-tech-4',
        category: 'TECHNICAL',
        trackId: 'track-technical',
        title: 'Operating Systems: Threads, Deadlocks & Virtual Memory',
        description: 'Process management, memory paging, synchronization primitives (mutexes, semaphores), and IPC.',
        estimatedMinutes: 50,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Diagnose race conditions and deadlocks using resource allocation graphs',
          'Explain page replacement algorithms (LRU, FIFO) and thrashing'
        ]
      }
    ]
  },
  {
    id: 'track-coding',
    category: 'CODING',
    title: 'Hands-on Algorithmic Coding Practice',
    description: 'Solve real-world coding interview challenges with timed test execution and edge-case validation.',
    iconName: 'Code',
    tasksCount: 3,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-code-1',
        category: 'CODING',
        trackId: 'track-coding',
        title: 'Two-Pointer & Sliding Window Techniques',
        description: 'Optimize O(n²) subarray and string problems to linear O(n) runtime.',
        estimatedMinutes: 45,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Identify problem constraints requiring continuous subarray tracking',
          'Manage left and right boundary conditions without off-by-one errors'
        ]
      },
      {
        id: 'task-code-2',
        category: 'CODING',
        trackId: 'track-coding',
        title: 'Dynamic Programming: Tabulation & Memoization',
        description: 'Overlapping subproblems, state transitions, and knapsack problem variations.',
        estimatedMinutes: 60,
        difficulty: 'Advanced',
        isCompleted: false,
        learningPoints: [
          'Derive state recurrence relations before writing code',
          'Optimize 2D DP matrices to 1D space complexity arrays'
        ]
      },
      {
        id: 'task-code-3',
        category: 'CODING',
        trackId: 'track-coding',
        title: 'Production-Grade Code Quality: Edge Cases & Error Handling',
        description: 'Write clean, self-documenting code with defensive bounds checks, null safety, and proper exception handling.',
        estimatedMinutes: 40,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Test empty collections, negative numbers, and integer overflow constraints',
          'Use meaningful variable naming and modular helper functions'
        ]
      }
    ]
  },
  {
    id: 'track-communication',
    category: 'COMMUNICATION',
    title: 'Professional Communication & Executive Presence',
    description: 'Elevate verbal articulation, executive presentation, and workplace correspondence.',
    iconName: 'MessageSquare',
    tasksCount: 3,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-comm-1',
        category: 'COMMUNICATION',
        trackId: 'track-communication',
        title: 'Professional Email & Corporate Messaging Etiquette',
        description: 'Drafting crisp status updates, formal inquiries to recruiters, and structured meeting follow-ups.',
        estimatedMinutes: 30,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Structure subject lines and call-to-action blocks clearly',
          'Maintain courteous, institutional tone in cross-functional dialogues'
        ]
      },
      {
        id: 'task-comm-2',
        category: 'COMMUNICATION',
        trackId: 'track-communication',
        title: 'Explaining Complex Technical Ideas to Non-Engineers',
        description: 'Frame architectural decisions in terms of business impact, reliability, and cost-efficiency.',
        estimatedMinutes: 45,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Use intuitive metaphors without sacrificing technical precision',
          'Lead with the outcome before detailing the implementation mechanism'
        ]
      },
      {
        id: 'task-comm-3',
        category: 'COMMUNICATION',
        trackId: 'track-communication',
        title: 'Executive Presentation Delivery & Slide Decks',
        description: 'Presenting capstones, project roadmaps, and design trade-offs under 10-minute time limits.',
        estimatedMinutes: 45,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Apply the 10/20/30 rule to technical slide decks',
          'Confidently field panel inquiries and handle tough questions gracefully'
        ]
      }
    ]
  },
  {
    id: 'track-interview',
    category: 'INTERVIEW',
    title: 'Interview Strategy & Behavioral Simulation',
    description: 'Master STAR behavioral responses, interviewer rapport, technical walkthroughs, and post-interview inquiries.',
    iconName: 'Award',
    tasksCount: 3,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-int-1',
        category: 'INTERVIEW',
        trackId: 'track-interview',
        title: 'STAR Method Mastery for Behavioral Scenarios',
        description: 'Structure Situation, Task, Action, and Result into concise 2-minute stories demonstrating impact.',
        estimatedMinutes: 40,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Emphasize YOUR specific actions rather than vague group efforts',
          'Quantify results with measurable metrics (latency reduction, % savings, user growth)'
        ]
      },
      {
        id: 'task-int-2',
        category: 'INTERVIEW',
        trackId: 'track-interview',
        title: 'Technical Project Walkthrough & Code Review Simulation',
        description: 'Walk an interviewer through your GitHub project codebase, architectural trade-offs, and lessons learned.',
        estimatedMinutes: 50,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Explain why specific libraries and databases were selected over alternatives',
          'Discuss past production bugs and the systematic debugging steps used to resolve them'
        ]
      },
      {
        id: 'task-int-3',
        category: 'INTERVIEW',
        trackId: 'track-interview',
        title: 'Strategic Questions to Ask Your Interviewer',
        description: 'Prepare insightful questions about team dynamics, engineering culture, and technological roadmaps.',
        estimatedMinutes: 30,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Demonstrate curiosity about upcoming quarterly engineering challenges',
          'Evaluate mentorship and growth opportunities within the prospective organization'
        ]
      }
    ]
  },
  {
    id: 'track-resume',
    category: 'RESUME',
    title: 'ATS Resume Architecture & Impact Metrics',
    description: 'Transform your resume into a Tier-1 compliant document that passes applicant tracking systems and impresses recruiters.',
    iconName: 'FileText',
    tasksCount: 3,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-res-1',
        category: 'RESUME',
        trackId: 'track-resume',
        title: 'The X-Y-Z Resume Bullet Formula',
        description: 'Accomplished [X], as measured by [Y], by doing [Z].',
        estimatedMinutes: 35,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Eliminate passive voice and replace with strong action verbs',
          'Ensure every bullet point includes tangible numbers or operational metrics'
        ]
      },
      {
        id: 'task-res-2',
        category: 'RESUME',
        trackId: 'track-resume',
        title: 'ATS Compliance & Clean Layout Standards',
        description: 'Remove multi-column tables, complex graphics, and non-standard fonts that break ATS parsers.',
        estimatedMinutes: 30,
        difficulty: 'Foundation',
        isCompleted: false,
        learningPoints: [
          'Use standardized section headers (Education, Experience, Projects, Skills)',
          'Ensure PDF output renders clean selectable text without glyph corruption'
        ]
      },
      {
        id: 'task-res-3',
        category: 'RESUME',
        trackId: 'track-resume',
        title: 'Tailoring Resume to Specific Job Descriptions',
        description: 'Strategically emphasize matching keywords and frameworks requested by the target role.',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Identify top 5 technical skills required in the job description',
          'Promote relevant coursework and project achievements to the top third of the page'
        ]
      }
    ]
  },
  {
    id: 'track-gd',
    category: 'GROUP_DISCUSSION',
    title: 'Group Discussion & Collaborative Articulation',
    description: 'Participate constructively in campus recruitment group discussions, case studies, and panel debates.',
    iconName: 'Users',
    tasksCount: 2,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-gd-1',
        category: 'GROUP_DISCUSSION',
        trackId: 'track-gd',
        title: 'Initiating & Structuring a Group Discussion',
        description: 'Opening discussions with a clear definition, contextual framing, and multi-perspective roadmap.',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Define the scope and core terminology before diving into opinions',
          'Encourage balanced participation without aggressive interjections'
        ]
      },
      {
        id: 'task-gd-2',
        category: 'GROUP_DISCUSSION',
        trackId: 'track-gd',
        title: 'Constructive Disagreement & Synthesis',
        description: 'Disagreeing politely using facts, acknowledging peer points, and providing balanced consensus.',
        estimatedMinutes: 40,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Use transition phrases: "Building upon that point..." or "Looking at this from another lens..."',
          'Step in to summarize the core discussion points if the group reaches an impasse'
        ]
      }
    ]
  },
  {
    id: 'track-domain',
    category: 'DOMAIN',
    title: 'Domain Deep-Dive: Cloud & Applied AI',
    description: 'Specialized competencies tailored to current hiring pipelines across cloud computing, microservices, and AI engineering.',
    iconName: 'Layers',
    tasksCount: 2,
    completedTasksCount: 0,
    tasks: [
      {
        id: 'task-dom-1',
        category: 'DOMAIN',
        trackId: 'track-domain',
        title: 'Cloud Deployment Foundations (Docker, Kubernetes, AWS)',
        description: 'Containerizing applications, orchestrating multi-service workloads, and basic CI/CD pipelines.',
        estimatedMinutes: 60,
        difficulty: 'Intermediate',
        isCompleted: false,
        learningPoints: [
          'Write multi-stage Dockerfiles for minimal production image footprints',
          'Deploy pods, services, and ingress controllers in Kubernetes'
        ]
      },
      {
        id: 'task-dom-2',
        category: 'DOMAIN',
        trackId: 'track-domain',
        title: 'Applied AI: Prompt Engineering & Model API Integration',
        description: 'Building modern AI-enabled applications using structured tool-calling, embeddings, and vector databases.',
        estimatedMinutes: 50,
        difficulty: 'Advanced',
        isCompleted: false,
        learningPoints: [
          'Implement RAG (Retrieval-Augmented Generation) pipelines with vector indexing',
          'Evaluate model hallucinations, context limits, and token cost economics'
        ]
      }
    ]
  }
];

export const OFFICIAL_INTERVIEW_PREP_QUESTIONS: InterviewPrepQuestion[] = [
  {
    id: 'q-star-1',
    category: 'Behavioral',
    question: 'Tell me about a challenging technical problem you encountered in a project and how you resolved it.',
    guidance: 'Use the STAR framework. Clearly state the situation, the specific technical roadblock, the engineering steps you personally executed, and the measurable outcome.',
    starFramework: {
      situation: 'During our 5th-semester capstone, our student portal database experienced high response times (>1200ms) under simulated 500 concurrent users.',
      task: 'I was responsible for backend performance diagnostics and database query optimization.',
      action: 'I profiled slow queries using EXPLAIN ANALYZE, identified missing composite indexes on foreign keys, and implemented an in-memory Redis caching layer for read-heavy routes.',
      result: 'Query latency dropped to under 85ms (a 92% reduction) and throughput increased from 80 req/sec to 650 req/sec without server errors.'
    },
    sampleAnswerSummary: 'Emphasize data-backed troubleshooting rather than guessing. Highlight your systematic process and quantified final result.'
  },
  {
    id: 'q-star-2',
    category: 'Situational',
    question: 'How do you handle working on a team project when a teammate misses their deadline or delivers incomplete code?',
    guidance: 'Focus on constructive communication, empathy, project impact prevention, and transparent accountability without assigning blame.',
    starFramework: {
      situation: 'In our software engineering lab sprint, a team member struggled with their assigned authentication module three days before the milestone submission.',
      task: 'As project coordinator, I needed to ensure our deliverables remained on schedule while supporting my colleague.',
      action: 'I scheduled a 30-minute pair-programming session to understand where they were stuck, broke down the remaining OAuth logic into smaller sub-tasks, and paired on the token-refresh handlers.',
      result: 'The authentication module passed all integration tests ahead of the sprint demo, and our colleague gained confidence in handling JWT workflows independently.'
    },
    sampleAnswerSummary: 'Recruiters look for high collaboration ownership, practical problem solving, and team lift rather than finger-pointing.'
  },
  {
    id: 'q-star-3',
    category: 'Technical',
    question: 'How do you decide between using a Relational (SQL) database versus a NoSQL document database for a new project?',
    guidance: 'Structure your answer around data access patterns, schema volatility, ACID transaction needs, and horizontal scaling requirements.',
    starFramework: {
      situation: 'Architecting the storage layer for a multi-school event management system with both rigid financial registrations and dynamic feedback forms.',
      task: 'Evaluate database trade-offs to select an optimal architecture for reliability and flexibility.',
      action: 'I chose PostgreSQL for user accounts, fee payments, and eligibility logs because strict ACID guarantees and foreign key constraints prevent double-booking. For dynamic, evolving event survey responses, I utilized PostgreSQL JSONB columns.',
      result: 'Maintained strict financial auditability while retaining schema flexibility for diverse student feedback forms without needing two disparate database servers.'
    },
    sampleAnswerSummary: 'Shows nuanced engineering judgment and cost-efficiency instead of dogmatic technology preferences.'
  }
];
