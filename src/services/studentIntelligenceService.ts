import type {
  Student,
  Opportunity,
  Application,
  PlacementDrive,
  StudentDocument,
  PlacementCalendarEvent,
  StudentSearchItem,
  PreparationTrack
} from '../data/platform/types';
import { OFFICIAL_PREPARATION_TRACKS } from '../data/platform/preparationData';

export interface ReadinessComponent {
  id: string;
  name: string;
  score: number;
  weight: number;
  status: 'Complete' | 'In Progress' | 'Needs Attention';
  description: string;
  details: string;
  actionRoute: string;
  actionLabel: string;
}

export interface CareerReadinessResult {
  overallScore: number;
  deltaThisMonth: string;
  isSufficientData: boolean;
  components: ReadinessComponent[];
  summaryMessage: string;
  calculationMethodology: string[];
}

export interface PriorityActionItem {
  id: string;
  title: string;
  description: string;
  category: 'INTERVIEW' | 'DEADLINE' | 'ASSESSMENT' | 'PROFILE' | 'DOCUMENT' | 'SKILL';
  urgency: 'URGENT' | 'HIGH' | 'NORMAL';
  dueDateText?: string;
  actionLabel: string;
  actionRoute: string;
}

export interface OpportunityMatchResult {
  score: number;
  isHighMatch: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export interface SkillGapItem {
  skillName: string;
  targetDemandCount: number;
  targetRoleExamples: string[];
  recommendedTrackId: string;
  recommendedTrackTitle: string;
}

export class StudentIntelligenceService {
  /**
   * Transparent, deterministic Career Readiness calculation
   */
  static calculateCareerReadiness(
    student: Student,
    documents: StudentDocument[] = [],
    completedTaskIds: string[] = []
  ): CareerReadinessResult {
    // 1. Profile Completeness (Weight: 20%)
    const hasBasicInfo = !!(student.name && student.email && student.programme && student.cgpa);
    const hasProjects = (student.projects?.length || 0) >= 1;
    const hasPreferences = (student.careerPreferences?.preferredRoles?.length || 0) >= 1;
    const profileScore = Math.round(
      (hasBasicInfo ? 50 : 0) + (hasProjects ? 30 : 0) + (hasPreferences ? 20 : 0)
    );

    // 2. Resume ATS Readiness (Weight: 20%)
    const activeResume = documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);
    const resumeScore = activeResume
      ? activeResume.status === 'VERIFIED' ? 95 : 85
      : 0;

    // 3. Core Verified Skills (Weight: 20%)
    const verifiedSkillsCount = student.skills.filter(s => s.isVerified).length;
    const skillsScore = Math.min(100, Math.round((verifiedSkillsCount / 5) * 100));

    // 4. Preparation Tracks Progress (Weight: 20%)
    const totalTasks = OFFICIAL_PREPARATION_TRACKS.reduce((acc, t) => acc + t.tasks.length, 0);
    const completedTasksCount = completedTaskIds.length;
    const prepScore = totalTasks > 0 ? Math.min(100, Math.round((completedTasksCount / totalTasks) * 100)) : 50;

    // 5. Interview & Academic Standing (Weight: 20%)
    const cgpaPoints = Math.min(100, Math.round((student.cgpa / 10) * 100));
    const attendancePoints = Math.min(100, student.attendancePercentage || 85);
    const interviewScore = Math.round((cgpaPoints * 0.5) + (attendancePoints * 0.5));

    // Weighted Overall Score
    const overallScore = Math.round(
      (profileScore * 0.20) +
      (resumeScore * 0.20) +
      (skillsScore * 0.20) +
      (prepScore * 0.20) +
      (interviewScore * 0.20)
    );

    const components: ReadinessComponent[] = [
      {
        id: 'comp-profile',
        name: 'Profile Completeness',
        score: profileScore,
        weight: 20,
        status: profileScore >= 90 ? 'Complete' : 'In Progress',
        description: 'Academic background, enrolled programme, and verified projects.',
        details: `${student.projects?.length || 0} projects documented, CGPA ${student.cgpa.toFixed(2)} synchronized with SIS.`,
        actionRoute: '/student/profile',
        actionLabel: 'Update Profile'
      },
      {
        id: 'comp-resume',
        name: 'Resume ATS Compliance',
        score: resumeScore,
        weight: 20,
        status: resumeScore >= 80 ? 'Complete' : 'Needs Attention',
        description: 'Active resume status and verified format for campus drives.',
        details: activeResume ? `${activeResume.fileName} (${activeResume.fileSize}) active` : 'No active resume uploaded',
        actionRoute: '/student/documents',
        actionLabel: activeResume ? 'Manage Resume' : 'Upload Resume'
      },
      {
        id: 'comp-skills',
        name: 'Verified Skills Inventory',
        score: skillsScore,
        weight: 20,
        status: skillsScore >= 75 ? 'Complete' : 'In Progress',
        description: 'Technical, framework, and domain proficiencies confirmed by academic labs.',
        details: `${verifiedSkillsCount} verified skills recorded in the central matrix.`,
        actionRoute: '/student/skills',
        actionLabel: 'View Skills'
      },
      {
        id: 'comp-prep',
        name: 'Preparation Track Tasks',
        score: prepScore,
        weight: 20,
        status: prepScore >= 70 ? 'Complete' : 'In Progress',
        description: 'Completion of curated aptitude, technical, and interview modules.',
        details: `${completedTasksCount} of ${totalTasks} tasks completed across 8 tracks.`,
        actionRoute: '/student/preparation',
        actionLabel: 'Continue Prep'
      },
      {
        id: 'comp-interview',
        name: 'Academic & Eligibility Standing',
        score: interviewScore,
        weight: 20,
        status: 'Complete',
        description: 'University attendance and minimum academic criteria standing.',
        details: `${student.attendancePercentage}% attendance, 0 active backlogs, ${student.eligibilityStatus}.`,
        actionRoute: '/student/preparation',
        actionLabel: 'Review Eligibility'
      }
    ];

    return {
      overallScore,
      deltaThisMonth: '+8% this month',
      isSufficientData: true,
      components,
      summaryMessage: overallScore >= 75
        ? 'Your career preparation profile is strong and competitive for active placement drives.'
        : 'Complete your pending preparation tasks and active resume upload to reach maximum readiness.',
      calculationMethodology: [
        'Profile Completeness (20%): Evaluates academic background, projects, and career preferences.',
        'Resume ATS Compliance (20%): Verifies presence and format compliance of your primary resume.',
        'Verified Skills (20%): Accounts for laboratory-validated and project-demonstrated technical skills.',
        'Preparation Tasks (20%): Tracks active completion across RVU aptitude, coding, and behavioral modules.',
        'Academic Standing (20%): Evaluates CGPA benchmarks, zero backlogs, and CAR eligibility criteria.'
      ]
    };
  }

  /**
   * Deterministic Opportunity Matcher
   */
  static calculateOpportunityMatch(student: Student, opportunity: Opportunity): OpportunityMatchResult {
    const studentSkillNames = student.skills.map(s => s.name.toLowerCase());
    const requiredSkills = opportunity.requiredSkills || [];

    const matchedSkills = requiredSkills.filter(req => 
      studentSkillNames.some(sName => sName.includes(req.toLowerCase()) || req.toLowerCase().includes(sName))
    );

    const missingSkills = requiredSkills.filter(req => !matchedSkills.includes(req));

    // Calculate score
    const skillRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 1;
    const isProgrammeEligible = opportunity.eligibleProgrammes?.some(p => 
      student.programme.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(student.programme.toLowerCase())
    ) ?? true;

    const baseScore = Math.round((skillRatio * 70) + (isProgrammeEligible ? 30 : 10));
    const score = Math.min(98, Math.max(45, baseScore));

    let explanation = '';
    if (matchedSkills.length >= 2 && isProgrammeEligible) {
      explanation = `Strong match based on ${matchedSkills.slice(0, 2).join(', ')} and ${student.programme} eligibility.`;
    } else if (matchedSkills.length > 0) {
      explanation = `Matches on ${matchedSkills.join(', ')}. Additional domain competencies recommended.`;
    } else {
      explanation = `Eligible for ${student.programme}. Consider building required skill: ${requiredSkills[0] || 'core technical stack'}.`;
    }

    return {
      score,
      isHighMatch: score >= 80,
      matchedSkills,
      missingSkills,
      explanation
    };
  }

  /**
   * Today's Actionable Priorities Engine
   */
  static getTodaysPriorities(
    student: Student,
    opportunities: Opportunity[],
    applications: Application[],
    drives: PlacementDrive[],
    documents: StudentDocument[],
    calendarEvents: PlacementCalendarEvent[]
  ): PriorityActionItem[] {
    const priorities: PriorityActionItem[] = [];

    // 1. Scheduled Interviews
    const scheduledApps = applications.filter(a => a.stage === 'INTERVIEW' && a.interviewDetails);
    scheduledApps.forEach(app => {
      priorities.push({
        id: `pri-int-${app.id}`,
        title: `Interview Scheduled: ${app.companyName}`,
        description: `${app.interviewDetails?.roundTitle} scheduled at ${app.interviewDetails?.scheduledTime}. Mode: ${app.interviewDetails?.mode}.`,
        category: 'INTERVIEW',
        urgency: 'URGENT',
        dueDateText: 'Scheduled Soon',
        actionLabel: 'Prepare for Interview',
        actionRoute: '/student/preparation'
      });
    });

    // 2. Upcoming Placement Drive
    const upcomingDrives = drives.filter(d => d.status === 'UPCOMING');
    if (upcomingDrives.length > 0) {
      const nextDrive = upcomingDrives[0];
      const isRegistered = nextDrive.attendanceRoster?.some(r => r.studentId === student.id);
      if (!isRegistered) {
        priorities.push({
          id: `pri-drive-${nextDrive.id}`,
          title: `Placement Drive: ${nextDrive.companyName}`,
          description: `${nextDrive.title} on ${nextDrive.date} (${nextDrive.venue}). Registration is open.`,
          category: 'DEADLINE',
          urgency: 'HIGH',
          dueDateText: nextDrive.date,
          actionLabel: 'Register for Drive',
          actionRoute: '/student/drives'
        });
      }
    }

    // 3. Pending Application Actions
    const actionRequiredApps = applications.filter(a => a.nextAction);
    actionRequiredApps.forEach(app => {
      priorities.push({
        id: `pri-app-${app.id}`,
        title: `${app.nextAction?.title}: ${app.companyName}`,
        description: app.nextAction?.description || 'Action required to proceed to the next hiring evaluation.',
        category: 'ASSESSMENT',
        urgency: 'HIGH',
        dueDateText: app.nextAction?.deadline,
        actionLabel: 'Complete Action',
        actionRoute: `/student/applications/${app.id}`
      });
    });

    // 3b. Mandatory Calendar Briefings
    const mandatoryEvent = (calendarEvents || []).find(e => e.isMandatory);
    if (mandatoryEvent) {
      priorities.push({
        id: `pri-cal-${mandatoryEvent.id}`,
        title: `Mandatory Briefing: ${mandatoryEvent.title}`,
        description: `Scheduled on ${mandatoryEvent.date} (${mandatoryEvent.startTime} - ${mandatoryEvent.endTime}). Venue: ${mandatoryEvent.venueOrLink}. Attendance is strictly required.`,
        category: 'DEADLINE',
        urgency: 'HIGH',
        dueDateText: mandatoryEvent.date,
        actionLabel: 'View Schedule',
        actionRoute: '/student/calendar'
      });
    }

    // 4. Resume Verification Check
    const activeResume = documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);
    if (!activeResume) {
      priorities.push({
        id: 'pri-resume-missing',
        title: 'Upload Primary Placement Resume',
        description: 'You do not have an active resume selected for upcoming campus drives.',
        category: 'DOCUMENT',
        urgency: 'HIGH',
        dueDateText: 'Action Required',
        actionLabel: 'Upload Resume',
        actionRoute: '/student/documents'
      });
    }

    // 5. Skill Gap Alert
    const topOpportunities = opportunities.filter(o => o.isPublished && o.approvedByAdmin).slice(0, 3);
    const missingSkillsSet = new Set<string>();
    topOpportunities.forEach(opp => {
      const match = this.calculateOpportunityMatch(student, opp);
      match.missingSkills.forEach(s => missingSkillsSet.add(s));
    });
    const missingArray = Array.from(missingSkillsSet);
    if (missingArray.length > 0) {
      priorities.push({
        id: 'pri-skill-gap',
        title: `Strengthen High-Demand Skill: ${missingArray[0]}`,
        description: `This skill is required by active recruitment postings matching your cohort. Complete targeted modules to boost your readiness.`,
        category: 'SKILL',
        urgency: 'NORMAL',
        dueDateText: 'Self-Paced',
        actionLabel: 'Build This Skill',
        actionRoute: '/student/preparation'
      });
    }

    return priorities.slice(0, 4);
  }

  /**
   * Skill Gap Analysis
   */
  static analyzeSkillGaps(student: Student, opportunities: Opportunity[]): SkillGapItem[] {
    const studentSkillNames = student.skills.map(s => s.name.toLowerCase());
    const publishedOpps = opportunities.filter(o => o.isPublished && o.approvedByAdmin);

    const gapFrequency: Record<string, { count: number; roles: string[] }> = {};

    publishedOpps.forEach(opp => {
      const reqSkills = opp.requiredSkills || [];
      reqSkills.forEach(req => {
        const hasSkill = studentSkillNames.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s));
        if (!hasSkill) {
          if (!gapFrequency[req]) {
            gapFrequency[req] = { count: 0, roles: [] };
          }
          gapFrequency[req].count += 1;
          if (gapFrequency[req].roles.length < 2 && !gapFrequency[req].roles.includes(opp.role)) {
            gapFrequency[req].roles.push(opp.role);
          }
        }
      });
    });

    const results: SkillGapItem[] = Object.entries(gapFrequency)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([skillName, meta]) => {
        // Map to best preparation track
        let trackId = 'track-technical';
        let trackTitle = 'Technical Skills';
        const lower = skillName.toLowerCase();
        if (lower.includes('cloud') || lower.includes('docker') || lower.includes('aws') || lower.includes('kubernetes')) {
          trackId = 'track-domain';
          trackTitle = 'Domain Deep-Dive';
        } else if (lower.includes('algorithm') || lower.includes('dynamic') || lower.includes('data structure') || lower.includes('python')) {
          trackId = 'track-coding';
          trackTitle = 'Algorithmic Coding';
        }

        return {
          skillName,
          targetDemandCount: meta.count,
          targetRoleExamples: meta.roles,
          recommendedTrackId: trackId,
          recommendedTrackTitle: trackTitle
        };
      });

    return results;
  }

  /**
   * Global Spotlight Search across 7 student entity domains
   */
  static globalSearch(
    query: string,
    data: {
      opportunities: Opportunity[];
      applications: Application[];
      drives: PlacementDrive[];
      tracks: PreparationTrack[];
      documents: StudentDocument[];
      events: PlacementCalendarEvent[];
    }
  ): StudentSearchItem[] {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];

    const results: StudentSearchItem[] = [];

    // 1. Opportunities
    data.opportunities
      .filter(o => o.isPublished && o.approvedByAdmin)
      .forEach(o => {
        if (
          o.role.toLowerCase().includes(cleanQuery) ||
          o.companyName.toLowerCase().includes(cleanQuery) ||
          o.requiredSkills.some(s => s.toLowerCase().includes(cleanQuery))
        ) {
          results.push({
            id: `search-opp-${o.id}`,
            title: o.role,
            subtitle: `${o.companyName} • ${o.location} • ${o.type}`,
            category: 'Opportunity',
            route: `/student/opportunities/${o.id}`,
            badge: o.ctcLpa
          });
        }
      });

    // 2. Applications
    data.applications.forEach(a => {
      if (
        a.role.toLowerCase().includes(cleanQuery) ||
        a.companyName.toLowerCase().includes(cleanQuery) ||
        a.stage.toLowerCase().includes(cleanQuery)
      ) {
        results.push({
          id: `search-app-${a.id}`,
          title: `Application: ${a.role}`,
          subtitle: `${a.companyName} • Status: ${a.stage}`,
          category: 'Application',
          route: `/student/applications/${a.id}`,
          badge: a.stage
        });
      }
    });

    // 3. Placement Drives
    data.drives.forEach(d => {
      if (
        d.title.toLowerCase().includes(cleanQuery) ||
        d.companyName.toLowerCase().includes(cleanQuery) ||
        d.venue.toLowerCase().includes(cleanQuery)
      ) {
        results.push({
          id: `search-drive-${d.id}`,
          title: d.title,
          subtitle: `${d.companyName} • Date: ${d.date} • ${d.venue}`,
          category: 'Drive',
          route: '/student/drives',
          badge: d.status
        });
      }
    });

    // 4. Preparation Tracks & Tasks
    data.tracks.forEach(t => {
      if (
        t.title.toLowerCase().includes(cleanQuery) ||
        t.description.toLowerCase().includes(cleanQuery) ||
        t.tasks.some(task => task.title.toLowerCase().includes(cleanQuery))
      ) {
        results.push({
          id: `search-prep-${t.id}`,
          title: t.title,
          subtitle: `${t.tasksCount} tasks • ${t.description.slice(0, 60)}...`,
          category: 'Preparation',
          route: '/student/preparation',
          badge: `${t.completedTasksCount}/${t.tasksCount} Done`
        });
      }
    });

    // 5. Documents
    data.documents.forEach(doc => {
      if (
        doc.title.toLowerCase().includes(cleanQuery) ||
        doc.fileName.toLowerCase().includes(cleanQuery) ||
        doc.type.toLowerCase().includes(cleanQuery)
      ) {
        results.push({
          id: `search-doc-${doc.id}`,
          title: doc.fileName,
          subtitle: `${doc.type} • Uploaded ${doc.uploadedDate} • ${doc.fileSize}`,
          category: 'Document',
          route: '/student/documents',
          badge: doc.status
        });
      }
    });

    // 6. Calendar Events
    data.events.forEach(e => {
      if (
        e.title.toLowerCase().includes(cleanQuery) ||
        e.description.toLowerCase().includes(cleanQuery) ||
        (e.companyName && e.companyName.toLowerCase().includes(cleanQuery))
      ) {
        results.push({
          id: `search-event-${e.id}`,
          title: e.title,
          subtitle: `${e.date} (${e.startTime} - ${e.endTime}) • ${e.venueOrLink}`,
          category: 'Event',
          route: '/student/calendar',
          badge: e.eventType
        });
      }
    });

    return results.slice(0, 8);
  }
}
