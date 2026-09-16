import { useState, useEffect } from 'react';
import type { 
  Student, 
  Opportunity, 
  PlacementDrive, 
  Application, 
  Offer, 
  StudentDocument, 
  PlacementNotification, 
  PlacementAnnouncement, 
  SupportTicket, 
  PlacementCalendarEvent,
  TicketCategory,
  TicketStatus,
  EligibilityStatus,
  ApplicationStage,
  RecruiterAccount,
  CompanyRecord,
  InterviewScheduleItem,
  StudentImportRecord,
  ActivityLog,
  PlacementPolicySettings,
  UserRole,
  RecruiterRole,
  RecruiterAssessment,
  RecruiterMessage,
  RecruiterNotification
} from './types';
import { 
  INITIAL_STUDENTS,
  INITIAL_RECRUITERS,
  INITIAL_COMPANIES,
  INITIAL_OPPORTUNITIES, 
  INITIAL_APPLICATIONS, 
  INITIAL_DRIVES, 
  INITIAL_INTERVIEWS,
  INITIAL_NOTIFICATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_TICKETS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_OFFERS,
  INITIAL_IMPORT_HISTORY,
  INITIAL_AUDIT_LOGS,
  DEFAULT_POLICY_SETTINGS,
  INITIAL_ASSESSMENTS,
  INITIAL_RECRUITER_MESSAGES,
  INITIAL_RECRUITER_NOTIFICATIONS,
  EMPTY_STUDENT,
  OFFICIAL_RVU_SCHOOLS
} from './demoData';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

class PlatformStore {
  private isLoadingFromDb: boolean = false;
  private isDbLoaded: boolean = false;
  private students: Student[] = [...INITIAL_STUDENTS];
  private recruiters: RecruiterAccount[] = [...INITIAL_RECRUITERS];
  private companies: CompanyRecord[] = [...INITIAL_COMPANIES];
  private opportunities: Opportunity[] = [...INITIAL_OPPORTUNITIES];
  private applications: Application[] = [...INITIAL_APPLICATIONS];
  private placementDrives: PlacementDrive[] = [...INITIAL_DRIVES];
  private interviews: InterviewScheduleItem[] = [...INITIAL_INTERVIEWS];
  private notifications: PlacementNotification[] = [...INITIAL_NOTIFICATIONS];
  private announcements: PlacementAnnouncement[] = [...INITIAL_ANNOUNCEMENTS];
  private documents: StudentDocument[] = [...INITIAL_DOCUMENTS];
  private tickets: SupportTicket[] = [...INITIAL_TICKETS];
  private calendarEvents: PlacementCalendarEvent[] = [...INITIAL_CALENDAR_EVENTS];
  private offers: Offer[] = [...INITIAL_OFFERS];
  private importHistory: StudentImportRecord[] = [...INITIAL_IMPORT_HISTORY];
  private auditLogs: ActivityLog[] = [...INITIAL_AUDIT_LOGS];
  private policySettings: PlacementPolicySettings = { ...DEFAULT_POLICY_SETTINGS };
  private currentRole: UserRole = 'PLACEMENT_ADMIN';

  // Recruiter Workspace State
  private activeRecruiterId: string = '';
  private assessments: RecruiterAssessment[] = [...INITIAL_ASSESSMENTS];
  private recruiterMessages: RecruiterMessage[] = [...INITIAL_RECRUITER_MESSAGES];
  private recruiterNotifications: RecruiterNotification[] = [...INITIAL_RECRUITER_NOTIFICATIONS];

  // Student Career Operating System State
  private savedOpportunityIds: string[] = [];
  private completedPreparationTaskIds: string[] = [];

  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public isDatabaseLoaded(): boolean {
    return this.isDbLoaded;
  }

  public isDatabaseLoading(): boolean {
    return this.isLoadingFromDb;
  }

  /**
   * Load real data from Supabase Postgres Database tables with RLS
   */
  public async loadFromDatabase(): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }
    if (this.isLoadingFromDb) return;
    this.isLoadingFromDb = true;

    try {
      // 1. Fetch Companies
      const { data: dbCompanies } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (dbCompanies && dbCompanies.length > 0) {
        this.companies = dbCompanies.map((c: any) => ({
          id: c.id,
          name: c.name,
          industry: c.industry || 'Technology',
          headquarters: 'Bengaluru, Karnataka',
          website: c.website || 'https://rvu.edu.in',
          tier: 'Marquee' as const,
          verificationStatus: c.verification_status === 'verified' ? 'VERIFIED' : 'PENDING',
          activeOpportunitiesCount: 0,
          totalPlacements: 0,
          highestPackageLPA: 0,
          primaryContactName: 'Campus Relations Lead',
          primaryContactEmail: 'campus@rvu.edu.in',
          logoUrl: c.logo_url,
          description: c.description || 'Corporate partner organization registered for RV University campus recruitment.'
        }));
      }

      // 2. Fetch Opportunities
      const { data: dbOpps } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbOpps && dbOpps.length > 0) {
        this.opportunities = dbOpps.map((o: any) => {
          const comp = this.companies.find(c => c.id === o.company_id);
          const ctcVal = 12;
          return {
            id: o.id,
            companyId: o.company_id,
            recruiterId: o.created_by || 'rec-system',
            companyName: comp?.name || 'Corporate Partner',
            companyLogo: comp?.logoUrl || '',
            role: o.title,
            type: (o.role_type === 'internship' ? 'Internship' : o.role_type === 'both' ? 'Full-Time' : 'Placement') as any,
            location: comp?.headquarters || 'Bengaluru, Karnataka',
            workMode: 'Hybrid' as const,
            ctcLpa: o.ctc_range || `₹${ctcVal} LPA`,
            lifecycleState: (o.status === 'published' ? 'PUBLISHED' : o.status === 'closed' ? 'ARCHIVED' : 'SUBMITTED_FOR_REVIEW') as any,
            isPublished: o.status === 'published',
            approvedByAdmin: o.status === 'published',
            approvedDate: o.created_at ? new Date(o.created_at).toLocaleDateString() : undefined,
            eligibleSchools: OFFICIAL_RVU_SCHOOLS,
            eligibleProgrammes: ['B.Tech Computer Science and Engineering', 'B.Sc Data Science', 'BBA', 'B.Des'],
            eligibleGraduationYears: [2025, 2026, 2027],
            minCgpa: Number(o.min_cgpa) || 6.0,
            maxBacklogsAllowed: 0,
            requiredSkills: ['Core Competencies', 'Analytical Problem Solving'],
            niceToHaveSkills: ['Full Stack Development', 'Cloud Fundamentals'],
            description: o.description || '',
            responsibilities: [
              'Collaborate with cross-functional engineering and product teams',
              'Contribute to production-grade architecture and development',
              'Adhere to corporate best practices and agile sprint cycles'
            ],
            selectionProcess: [
              { roundNumber: 1, title: 'Online Assessment', mode: 'Online', description: 'Technical & Aptitude Assessment' },
              { roundNumber: 2, title: 'Technical Evaluation', mode: 'Hybrid', description: 'System Design & Problem Solving' },
              { roundNumber: 3, title: 'HR & Leadership Fitment', mode: 'In-person', description: 'Institutional fitment and compensation discussion' }
            ],
            applicationDeadline: o.deadline ? new Date(o.deadline).toLocaleDateString() : 'Rolling',
            driveDate: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Upcoming',
            openingsCount: 5,
            matchScoreForDemoStudent: 88,
            verifiedAt: o.created_at ? new Date(o.created_at).toLocaleDateString() : undefined
          };
        });
      }

      // 3. Fetch Applications
      const { data: dbApps } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbApps && dbApps.length > 0) {
        this.applications = dbApps.map((a: any) => {
          const opp = this.opportunities.find(o => o.id === a.opportunity_id);
          const submitted = a.created_at ? new Date(a.created_at).toLocaleString() : 'Recent';
          const stageMap: Record<string, ApplicationStage> = {
            applied: 'APPLIED',
            screening: 'UNDER_REVIEW',
            shortlisted: 'SHORTLISTED',
            assessment: 'ASSESSMENT',
            interview: 'INTERVIEW',
            offered: 'OFFER',
            rejected: 'REJECTED',
            withdrawn: 'WITHDRAWN'
          };
          const stage: ApplicationStage = stageMap[a.stage] || 'APPLIED';
          return {
            id: a.id,
            studentId: a.student_id,
            opportunityId: a.opportunity_id,
            recruiterId: opp?.recruiterId || 'rec-system',
            companyName: opp?.companyName || 'Corporate Partner',
            companyLogo: opp?.companyLogo || '',
            role: opp?.role || 'Campus Position',
            type: opp?.type || 'Placement',
            location: opp?.location || 'Bengaluru',
            compensation: opp?.ctcLpa || 'Competitive',
            stage,
            submittedAt: submitted,
            updatedAt: submitted,
            resumeFileName: a.resume_url ? a.resume_url.split('/').pop() || 'Verified_Resume.pdf' : 'Student_Resume.pdf',
            resumeDataUrl: a.resume_url,
            resumeSize: '320 KB',
            timeline: [
              { stage: 'APPLIED', label: 'Application Submitted', timestamp: submitted, completed: true, active: false, remarks: 'Submitted to RVU Career Hub' }
            ]
          };
        });
      }

      // 4. Fetch Placement Drives
      const { data: dbDrives } = await supabase
        .from('placement_drives')
        .select('*')
        .order('drive_date', { ascending: true });

      if (dbDrives && dbDrives.length > 0) {
        this.placementDrives = dbDrives.map((d: any) => {
          const comp = this.companies.find(c => c.id === d.company_id);
          return {
            id: d.id,
            title: d.title,
            companyId: d.company_id,
            companyName: comp?.name || 'Corporate Partner',
            companyLogo: comp?.logoUrl || '',
            date: d.drive_date ? new Date(d.drive_date).toLocaleDateString() : 'Upcoming',
            timeSlot: '09:00 AM - 05:00 PM IST',
            venue: d.venue || 'RV University Campus, Bengaluru',
            mode: 'On-Campus' as const,
            eligibleProgrammes: ['B.Tech Computer Science and Engineering', 'B.Sc Data Science', 'BBA', 'B.Des'],
            associatedOpportunityIds: [],
            status: (d.status === 'completed' ? 'COMPLETED' : d.status === 'cancelled' ? 'CANCELLED' : 'UPCOMING') as any,
            instructions: [
              'Formal institutional dress code mandatory',
              'Carry 3 physical copies of verified resume',
              'Valid RVU student identity card required at venue'
            ],
            coordinatorContact: {
              name: 'CAR Placement Cell',
              role: 'Faculty Placement Coordinator',
              email: 'placements@rvu.edu.in'
            },
            attendanceRoster: []
          };
        });
      }

      // 5. Fetch Interview Schedules
      const { data: dbInts } = await supabase
        .from('interview_schedules')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (dbInts && dbInts.length > 0) {
        this.interviews = dbInts.map((i: any) => {
          const app = this.applications.find(a => a.id === i.application_id);
          const opp = this.opportunities.find(o => o.id === app?.opportunityId);
          const student = this.students.find(s => s.id === app?.studentId);
          const schDate = i.scheduled_at ? new Date(i.scheduled_at) : new Date();
          return {
            id: i.id,
            applicationId: i.application_id,
            studentId: app?.studentId || 'RVU-PENDING',
            studentName: student?.name || 'Candidate',
            studentEmail: student?.email || 'student@rvu.edu.in',
            programme: student?.programme || 'Undergraduate',
            companyId: opp?.companyId || 'comp-1',
            companyName: app?.companyName || 'Corporate Partner',
            role: app?.role || 'Position',
            roundNumber: i.round_number || 1,
            roundTitle: i.round_title || 'Technical Round 1',
            date: schDate.toLocaleDateString(),
            timeSlot: schDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mode: (i.meeting_link ? 'Google Meet' : 'In-person') as any,
            venueOrLink: i.meeting_link || 'RVU Campus Interview Suite, Room 302',
            interviewerName: i.interviewer_name || 'Technical Evaluator',
            status: (i.status === 'completed' ? 'COMPLETED' : i.status === 'cancelled' ? 'CANCELLED' : 'SCHEDULED') as any,
            remarks: i.remarks || undefined
          };
        });
      }

      // 6. Fetch Offers
      const { data: dbOffers } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbOffers && dbOffers.length > 0) {
        this.offers = dbOffers.map((o: any) => {
          const app = this.applications.find(a => a.id === o.application_id);
          const student = this.students.find(s => s.id === app?.studentId);
          return {
            id: o.id,
            applicationId: o.application_id,
            studentId: app?.studentId || o.student_id || 'RVU-PENDING',
            studentName: student?.name || 'Candidate',
            companyId: o.company_id || 'comp-1',
            companyName: app?.companyName || 'Corporate Partner',
            companyLogo: app?.companyLogo || '',
            role: o.designation || app?.role || 'Campus Position',
            ctcLpa: `₹${o.ctc_annual || 12} LPA`,
            location: app?.location || 'Bengaluru',
            status: (o.status === 'accepted' ? 'OFFER_ACCEPTED' : o.status === 'declined' ? 'OFFER_DECLINED' : 'OFFER_RECEIVED') as any,
            offerDate: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent',
            acceptanceDeadline: o.valid_until ? new Date(o.valid_until).toLocaleDateString() : '3 Days',
            offerLetterUrl: o.offer_letter_url || '#',
            termsSummary: ['Standard institutional campus placement terms apply.'],
            placementOfficeVerified: o.status === 'verified'
          };
        });
      }

      // 7. Fetch Student Documents
      const { data: dbDocs } = await supabase
        .from('student_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbDocs && dbDocs.length > 0) {
        this.documents = dbDocs.map((d: any) => ({
          id: d.id,
          studentId: d.student_id,
          type: (d.document_type === 'resume' ? 'RESUME' : d.document_type === 'transcript' ? 'TRANSCRIPT' : 'CERTIFICATE') as any,
          title: d.title || 'Document',
          fileName: d.title || 'Document.pdf',
          fileSize: `${Math.round((d.file_size_bytes || 250000) / 1024)} KB`,
          uploadedDate: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Recent',
          status: d.is_verified ? 'VERIFIED' : 'PENDING_VERIFICATION',
          isActiveForApplications: d.document_type === 'resume',
          downloadUrl: d.file_url || '#'
        }));
      }

      // 8. Fetch Profiles & Students
      const { data: dbProfiles } = await supabase
        .from('profiles')
        .select('*, students(*)')
        .eq('role', 'student');

      if (dbProfiles && dbProfiles.length > 0) {
        this.students = dbProfiles.map((p: any) => {
          const s = Array.isArray(p.students) ? p.students[0] : p.students;
          return {
            id: p.id,
            universityRegisterNumber: s?.usn || p.id,
            name: p.full_name || 'Authenticated Student',
            email: p.email,
            phone: p.phone || '+91 98860 00000',
            avatarUrl: p.avatar_url,
            isDemo: false,
            school: s?.school || 'School of Computer Science and Engineering',
            programme: s?.programme || 'B.Tech Computer Science and Engineering',
            specialization: 'General',
            academicYear: 'Final Year',
            semester: 6,
            batch: s?.batch || '2023–2027',
            graduationYear: s?.graduation_year || 2027,
            cgpa: Number(s?.cgpa) || 0,
            activeBacklogs: Number(s?.active_backlogs) || 0,
            attendancePercentage: Number(s?.attendance_percentage) || 0,
            placementStatus: (s?.placement_status as any) || 'NOT_STARTED',
            eligibilityStatus: (s?.eligibility_status as any) || 'ELIGIBLE',
            eligibilityDriveScope: 'AY 2026–27 Campus Placement Drives',
            eligibilityRemarks: 'Verified Institutional Student Profile',
            verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
            verifiedDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'AY 2026–27',
            readinessScore: 80,
            readinessBreakdown: { profile: 85, resume: 80, skills: 80, technicalPrep: 75, communication: 80, interviewPrep: 70 },
            skills: Array.isArray(s?.skills) ? (s.skills as any[]).map((sk: any, i: number) => ({
              id: `sk-${i}`,
              name: typeof sk === 'string' ? sk : sk?.name || 'Skill',
              level: 'Intermediate' as const,
              category: 'Core Technical' as const,
              isVerified: true
            })) : [],
            skillsToDevelop: [],
            projects: [],
            careerPreferences: {
              preferredRoles: ['Software Engineer', 'Data Analyst'],
              preferredLocations: ['Bengaluru'],
              workMode: ['Hybrid', 'On-site'],
              expectedCTCMinLPA: 8.0
            }
          };
        });
      }

      // 9. Fetch Audit Logs
      const { data: dbLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (dbLogs && dbLogs.length > 0) {
        this.auditLogs = dbLogs.map((l: any) => ({
          id: l.id,
          timestamp: l.created_at ? new Date(l.created_at).toLocaleString() : 'Recent',
          actor: l.actor_user_id || 'Institutional User',
          actorRole: 'SUPER_ADMIN' as const,
          action: l.action,
          targetEntity: l.entity_type,
          entityId: l.entity_id,
          details: typeof l.metadata === 'object' ? JSON.stringify(l.metadata) : String(l.metadata || '')
        }));
      }

      this.isDbLoaded = true;
      this.notify();
    } catch (err) {
      console.warn('Supabase initial database load notification:', err);
    } finally {
      this.isLoadingFromDb = false;
    }
  }

  // --- ROLE & AUTHENTICATION SIMULATION ---
  public getCurrentRole(): UserRole {
    return this.currentRole;
  }

  public setCurrentRole(role: UserRole) {
    this.currentRole = role;
    this.logAction('Role Switched', 'UserSession', undefined, `Active session role switched to ${role}`);
    this.notify();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): ActivityLog[] {
    return this.auditLogs;
  }

  public logAction(action: string, targetEntity: string, entityId?: string, details?: string) {
    const now = new Date();
    const formatted = `${now.getDate()} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const log: ActivityLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
      actor: this.currentRole === 'SUPER_ADMIN' ? 'CAR Director (Super Admin)' : 'CAR Placement Admin',
      actorRole: this.currentRole,
      action,
      targetEntity,
      entityId,
      details: details || `${action} executed on ${targetEntity} ${entityId || ''}`
    };
    this.auditLogs = [log, ...this.auditLogs];

    // Persist immutable audit log to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('audit_logs').insert({
        action,
        entity_type: targetEntity,
        entity_id: entityId || null,
        actor_role: log.actorRole,
        metadata: { details: log.details, actor: log.actor }
      }).then(({ error }) => {
        if (error) console.warn('Supabase audit log insert note:', error.message);
      });
    }

    this.notify();
  }

  // --- STUDENT MANAGEMENT ---
  public getStudents(): Student[] {
    return this.students;
  }

  public getStudent(email?: string): Student {
    if (email) {
      const match = this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (match) return match;
    }
    if (this.students.length > 0) return this.students[0];

    const studentName = email ? email.split('@')[0].replace(/[._-]+/g, ' ').toUpperCase() : 'Authenticated Student';
    return {
      ...EMPTY_STUDENT,
      id: 'STUDENT-ACTIVE',
      name: studentName,
      email: email || 'student@rvu.edu.in'
    };
  }

  public getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  public addStudent(student: Student) {
    this.students = [student, ...this.students];
    this.logAction('Student Created', 'Student', student.id, `Manual creation for ${student.name} (${student.programme})`);
    this.notify();
  }

  public updateStudent(id: string, updates: Partial<Student>) {
    this.students = this.students.map(s => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    });
    this.logAction('Student Updated', 'Student', id, `Updated fields: ${Object.keys(updates).join(', ')}`);
    this.notify();
  }

  public deactivateStudent(id: string, reason?: string) {
    this.students = this.students.map(s => {
      if (s.id === id) {
        return { ...s, isDeactivated: true, deactivatedReason: reason || 'Deactivated by CAR Administrator' };
      }
      return s;
    });
    this.logAction('Student Deactivated', 'Student', id, reason || 'Student record marked inactive (history preserved)');
    this.notify();
  }

  public restoreStudent(id: string) {
    this.students = this.students.map(s => {
      if (s.id === id) {
        return { ...s, isDeactivated: false, deactivatedReason: undefined };
      }
      return s;
    });
    this.logAction('Student Restored', 'Student', id, 'Student record restored to active placement master');
    this.notify();
  }

  public bulkUpdateEligibility(ids: string[], status: EligibilityStatus, remarks: string) {
    const verifiedDate = `${new Date().getDate()} Sep 2026`;
    this.students = this.students.map(s => {
      if (ids.includes(s.id)) {
        return {
          ...s,
          eligibilityStatus: status,
          eligibilityRemarks: remarks,
          verifiedDate,
          verifiedBy: 'Corporate & Alumni Relations (CAR) Office'
        };
      }
      return s;
    });
    this.logAction('Bulk Eligibility Updated', 'Student', `${ids.length} records`, `Set status to ${status}: ${remarks}`);
    this.notify();
  }

  public bulkAssignDrive(studentIds: string[], driveId: string) {
    const drive = this.placementDrives.find(d => d.id === driveId);
    if (!drive) return;

    const existingIds = new Set(drive.attendanceRoster?.map(r => r.studentId) || []);
    const newRosterItems = studentIds
      .filter(id => !existingIds.has(id))
      .map(id => {
        const student = this.students.find(s => s.id === id);
        return {
          studentId: id,
          studentName: student?.name || id,
          registeredAt: `${new Date().getDate()} Sep 2026`,
          attendanceStatus: 'REGISTERED' as const
        };
      });

    this.placementDrives = this.placementDrives.map(d => {
      if (d.id === driveId) {
        return {
          ...d,
          attendanceRoster: [...(d.attendanceRoster || []), ...newRosterItems]
        };
      }
      return d;
    });

    this.logAction('Bulk Drive Assigned', 'PlacementDrive', driveId, `Assigned ${studentIds.length} students to ${drive.title}`);
    this.notify();
  }

  // --- EXCEL IMPORT ENGINE ---
  public getImportHistory(): StudentImportRecord[] {
    return this.importHistory;
  }

  public recordImport(record: StudentImportRecord) {
    this.importHistory = [record, ...this.importHistory];
    this.logAction('Excel Student Import', 'StudentMaster', record.id, `File ${record.fileName}: +${record.addedCount} added, ~${record.updatedCount} updated, !${record.errorCount} errors`);
    this.notify();
  }

  public commitExcelImport(
    records: Partial<Student>[],
    strategy: 'add_and_update' | 'skip_existing',
    fileMeta: { name: string; size: string }
  ): { added: number; updated: number; skipped: number } {
    let added = 0;
    let updated = 0;
    let skipped = 0;

    const existingMap = new Map(this.students.map(s => [s.id.toUpperCase(), s]));

    const updatedStudentsList = [...this.students];

    records.forEach(row => {
      if (!row.id) return;
      const normalizedId = row.id.toUpperCase();
      const existing = existingMap.get(normalizedId);

      if (existing) {
        if (strategy === 'add_and_update') {
          const index = updatedStudentsList.findIndex(s => s.id.toUpperCase() === normalizedId);
          if (index !== -1) {
            updatedStudentsList[index] = {
              ...updatedStudentsList[index],
              ...row,
              id: existing.id // preserve exact casing
            };
            updated++;
          }
        } else {
          skipped++;
        }
      } else {
        // Create full student object with defaults
        const newStudent: Student = {
          id: row.id,
          universityRegisterNumber: row.universityRegisterNumber || `2023${row.id.replace(/\D/g, '')}`,
          name: row.name || 'New Student',
          email: row.email || `${row.id.toLowerCase()}@rvu.edu.in`,
          phone: row.phone || '+91 98860 00000',
          isDemo: false,
          school: row.school || 'School of Computer Science & Engineering',
          programme: row.programme || 'B.Tech (Hons.) Computer Science & Engineering',
          specialization: row.specialization || 'General',
          academicYear: row.academicYear || '3rd Year (Semester VI)',
          semester: row.semester || 6,
          batch: row.batch || '2023–2027',
          graduationYear: row.graduationYear || 2027,
          cgpa: row.cgpa ?? 7.5,
          activeBacklogs: row.activeBacklogs ?? 0,
          attendancePercentage: row.attendancePercentage ?? 85,
          placementStatus: row.placementStatus || 'ELIGIBLE',
          eligibilityStatus: row.eligibilityStatus || 'ELIGIBLE',
          eligibilityDriveScope: row.eligibilityDriveScope || '2026–27 Placement Drives',
          eligibilityRemarks: row.eligibilityRemarks || 'Imported via CAR Placement Master Excel Batch.',
          verifiedBy: 'Corporate & Alumni Relations (CAR) Office',
          verifiedDate: `${new Date().getDate()} Sep 2026`,
          readinessScore: row.readinessScore || 75,
          readinessBreakdown: row.readinessBreakdown || { profile: 90, resume: 80, skills: 70, technicalPrep: 70, communication: 75, interviewPrep: 65 },
          skills: row.skills || [{ id: `sk-${Date.now()}`, name: 'Python', level: 'Intermediate', category: 'Core Technical', isVerified: true }],
          skillsToDevelop: [],
          projects: [],
          careerPreferences: {
            preferredRoles: ['Software Engineer', 'Associate Analyst'],
            preferredLocations: ['Bengaluru'],
            workMode: ['Hybrid'],
            expectedCTCMinLPA: 10.0
          }
        };

        updatedStudentsList.push(newStudent);
        existingMap.set(normalizedId, newStudent);
        added++;
      }
    });

    this.students = updatedStudentsList;

    // Log to import history
    const importRecord: StudentImportRecord = {
      id: `IMP-2026-00${this.importHistory.length + 1}`,
      fileName: fileMeta.name,
      fileSize: fileMeta.size,
      uploadedBy: this.currentRole === 'SUPER_ADMIN' ? 'CAR Director' : 'CAR Admin',
      timestamp: `${new Date().getDate()} Sep 2026, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      totalRows: records.length,
      addedCount: added,
      updatedCount: updated,
      warningCount: 0,
      errorCount: 0,
      status: 'COMPLETED'
    };

    this.recordImport(importRecord);
    this.notify();

    return { added, updated, skipped };
  }

  // --- RECRUITERS & COMPANIES ---
  public getRecruiters(): RecruiterAccount[] {
    return this.recruiters;
  }

  public getCompanies(): CompanyRecord[] {
    return this.companies;
  }

  public verifyRecruiter(id: string) {
    this.recruiters = this.recruiters.map(r => r.id === id ? { ...r, verificationStatus: 'VERIFIED' } : r);
    this.logAction('Recruiter Verified', 'Recruiter', id, 'Recruiter credentials verified by CAR Office');
    this.notify();
  }

  public suspendRecruiter(id: string) {
    this.recruiters = this.recruiters.map(r => r.id === id ? { ...r, verificationStatus: 'SUSPENDED' } : r);
    this.logAction('Recruiter Suspended', 'Recruiter', id, 'Recruiter access suspended by CAR Administrator');
    this.notify();
  }

  public verifyCompany(id: string) {
    this.companies = this.companies.map(c => c.id === id ? { ...c, verificationStatus: 'VERIFIED' } : c);
    this.logAction('Company Verified', 'Company', id, 'Corporate partnership approved for campus hiring');
    this.notify();
  }

  public addCompany(company: CompanyRecord) {
    this.companies = [company, ...this.companies];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      supabase.from('companies').insert({
        id: company.id,
        name: company.name,
        logo_url: company.logoUrl || null,
        industry: company.industry || null,
        website: company.website || null,
        description: company.overview || company.description || null,
        verification_status: company.verificationStatus === 'VERIFIED' ? 'verified' : 'pending'
      }).then(({ error }) => {
        if (error) console.error('Supabase company sync error:', error);
      });
    }

    this.logAction('Company Added', 'Company', company.id, `New partner organization registered: ${company.name}`);
    this.notify();
  }

  // --- OPPORTUNITIES (CAR APPROVAL GATE) ---
  public getOpportunities(): Opportunity[] {
    return this.opportunities;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.opportunities.find(o => o.id === id);
  }

  public approveOpportunity(id: string) {
    const opp = this.opportunities.find(o => o.id === id);
    if (!opp) return;

    this.opportunities = this.opportunities.map(o => {
      if (o.id === id) {
        return {
          ...o,
          approvedByAdmin: true,
          isPublished: true,
          lifecycleState: 'PUBLISHED',
          approvedDate: `${new Date().getDate()} Sep 2026`
        };
      }
      return o;
    });

    // Notify students across relevant schools
    this.notifications = [
      {
        id: `NOTIF-OPP-${Date.now()}`,
        studentId: 'ALL',
        title: `Campus Opportunity Published: ${opp.role}`,
        message: `${opp.companyName} has opened applications for ${opp.role} (${opp.ctcLpa}). Check your eligibility and apply.`,
        category: 'PLACEMENT',
        origin: 'PLACEMENT_OFFICE',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/student/opportunities/${opp.id}`
      },
      ...this.notifications
    ];

    this.logAction('Opportunity Approved & Published', 'Opportunity', id, `Approved ${opp.role} at ${opp.companyName}`);
    this.notify();
  }

  public rejectOpportunity(id: string, reason: string) {
    this.opportunities = this.opportunities.map(o => {
      if (o.id === id) {
        return {
          ...o,
          approvedByAdmin: false,
          isPublished: false,
          lifecycleState: 'REJECTED',
          rejectionReason: reason
        };
      }
      return o;
    });

    this.logAction('Opportunity Rejected', 'Opportunity', id, `Reason: ${reason}`);
    this.notify();
  }

  // --- APPLICATIONS ---
  public getApplications(): Application[] {
    return this.applications;
  }

  public getApplicationById(id: string): Application | undefined {
    return this.applications.find(a => a.id === id);
  }

  public updateApplicationStage(id: string, stage: ApplicationStage, remarks?: string) {
    const app = this.applications.find(a => a.id === id);
    if (!app) return;

    const now = new Date();
    const dateFormatted = `${now.getDate()} Sep 2026`;

    this.applications = this.applications.map(a => {
      if (a.id === id) {
        const updatedTimeline = a.timeline.map(step => {
          if (step.stage === stage) {
            return { ...step, completed: true, active: false, timestamp: dateFormatted, remarks };
          }
          if (step.completed) return step;
          return { ...step, active: false };
        });

        return {
          ...a,
          stage,
          updatedAt: `${dateFormatted}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          timeline: updatedTimeline
        };
      }
      return a;
    });

    // Notify student
    this.notifications = [
      {
        id: `NOTIF-APP-STAGE-${Date.now()}`,
        studentId: app.studentId,
        title: `Application Update: ${app.role}`,
        message: `Your application at ${app.companyName} has moved to stage: ${stage}.`,
        category: 'APPLICATION',
        origin: 'PLACEMENT_OFFICE',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/student/applications/${app.id}`
      },
      ...this.notifications
    ];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      const stageMapping: Record<ApplicationStage, 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'offered' | 'rejected' | 'withdrawn'> = {
        APPLIED: 'applied',
        UNDER_REVIEW: 'screening',
        SHORTLISTED: 'shortlisted',
        ASSESSMENT: 'assessment',
        INTERVIEW: 'interview',
        SELECTED: 'offered',
        OFFER: 'offered',
        JOINED: 'offered',
        REJECTED: 'rejected',
        WITHDRAWN: 'withdrawn'
      };
      const dbStage = stageMapping[stage] || 'applied';
      supabase.from('applications').update({
        stage: dbStage,
        feedback: remarks || null,
        updated_at: new Date().toISOString()
      }).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase application update error:', error);
      });
    }

    this.logAction('Application Stage Updated', 'Application', id, `Moved to ${stage} for student ${app.studentId}`);
    this.notify();
  }

  // --- PLACEMENT DRIVES ---
  public getPlacementDrives(): PlacementDrive[] {
    return this.placementDrives;
  }

  public getPlacementDriveById(id: string): PlacementDrive | undefined {
    return this.placementDrives.find(d => d.id === id);
  }

  public createPlacementDrive(drive: PlacementDrive) {
    this.placementDrives = [drive, ...this.placementDrives];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      supabase.from('placement_drives').insert({
        id: drive.id,
        company_id: drive.companyId,
        title: drive.title,
        drive_date: new Date().toISOString(),
        venue: drive.venue || null,
        status: drive.status === 'COMPLETED' ? 'completed' : 'scheduled'
      }).then(({ error }) => {
        if (error) console.error('Supabase drive sync error:', error);
      });
    }

    this.logAction('Placement Drive Created', 'PlacementDrive', drive.id, `Drive created: ${drive.title} for ${drive.date}`);
    this.notify();
  }

  public updatePlacementDrive(id: string, updates: Partial<PlacementDrive>) {
    this.placementDrives = this.placementDrives.map(d => d.id === id ? { ...d, ...updates } : d);
    this.logAction('Placement Drive Updated', 'PlacementDrive', id, `Updated fields: ${Object.keys(updates).join(', ')}`);
    this.notify();
  }

  public updateDriveAttendance(driveId: string, studentId: string, status: any) {
    this.placementDrives = this.placementDrives.map(d => {
      if (d.id === driveId && d.attendanceRoster) {
        return {
          ...d,
          attendanceRoster: d.attendanceRoster.map(r => r.studentId === studentId ? { ...r, attendanceStatus: status } : r)
        };
      }
      return d;
    });
    this.logAction('Drive Attendance Marked', 'PlacementDrive', driveId, `Student ${studentId} marked as ${status}`);
    this.notify();
  }

  // --- INTERVIEWS ---
  public getInterviews(): InterviewScheduleItem[] {
    return this.interviews;
  }

  public scheduleInterview(item: InterviewScheduleItem) {
    this.interviews = [item, ...this.interviews];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      supabase.from('interview_schedules').insert({
        id: item.id,
        application_id: item.applicationId,
        round_number: item.roundNumber || 1,
        round_title: item.roundTitle || 'Technical Round',
        scheduled_at: new Date().toISOString(),
        meeting_link: item.venueOrLink.toLowerCase().includes('http') ? item.venueOrLink : null,
        interviewer_name: item.interviewerName || null,
        status: 'scheduled'
      }).then(({ error }) => {
        if (error) console.error('Supabase interview sync error:', error);
      });
    }

    // Add to shared calendar
    const newCalEvent: PlacementCalendarEvent = {
      id: `CAL-INT-${Date.now()}`,
      title: `Interview: ${item.companyName} (${item.roundTitle})`,
      eventType: 'INTERVIEW',
      date: item.date,
      startTime: item.timeSlot.split('-')[0].trim(),
      endTime: item.timeSlot.split('-')[1]?.trim() || '',
      companyName: item.companyName,
      venueOrLink: item.venueOrLink,
      description: `Round ${item.roundNumber} for ${item.role} with ${item.interviewerName}`,
      isMandatory: true
    };
    this.calendarEvents = [newCalEvent, ...this.calendarEvents];

    // Notify student
    this.notifications = [
      {
        id: `NOTIF-INT-${Date.now()}`,
        studentId: item.studentId,
        title: `Interview Scheduled: ${item.companyName}`,
        message: `Your interview for ${item.role} is confirmed on ${item.date} at ${item.timeSlot}.`,
        category: 'INTERVIEW',
        origin: 'PLACEMENT_OFFICE',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: '/student/calendar'
      },
      ...this.notifications
    ];

    this.logAction('Interview Scheduled', 'Interview', item.id, `Round ${item.roundNumber} for ${item.studentName} at ${item.companyName}`);
    this.notify();
  }

  public rescheduleInterview(id: string, newDate: string, newTime: string, mode: any, venue: string) {
    this.interviews = this.interviews.map(i => {
      if (i.id === id) {
        return {
          ...i,
          date: newDate,
          timeSlot: newTime,
          mode,
          venueOrLink: venue,
          status: 'RESCHEDULED'
        };
      }
      return i;
    });

    const interview = this.interviews.find(i => i.id === id);
    if (interview) {
      this.notifications = [
        {
          id: `NOTIF-INT-RESCHED-${Date.now()}`,
          studentId: interview.studentId,
          title: `Interview Rescheduled: ${interview.companyName}`,
          message: `Your interview has been updated to ${newDate} at ${newTime}. Venue: ${venue}.`,
          category: 'INTERVIEW',
          origin: 'PLACEMENT_OFFICE',
          timestamp: 'Just now',
          isRead: false,
          actionRoute: '/student/calendar'
        },
        ...this.notifications
      ];
    }

    this.logAction('Interview Rescheduled', 'Interview', id, `Updated to ${newDate} ${newTime}`);
    this.notify();
  }

  // --- OFFERS ---
  public getOffers(): Offer[] {
    return this.offers;
  }

  public verifyOffer(id: string) {
    const now = new Date();
    const verifiedAt = `${now.getDate()} Sep 2026`;
    const officerName = this.currentRole === 'SUPER_ADMIN' ? 'CAR Director' : 'CAR Placement Admin';

    this.offers = this.offers.map(o => {
      if (o.id === id) {
        return {
          ...o,
          placementOfficeVerified: true,
          status: 'OFFER_RECEIVED',
          verifiedBy: officerName,
          verifiedAt
        };
      }
      return o;
    });

    const offer = this.offers.find(o => o.id === id);
    if (offer) {
      // Update student placement status
      this.students = this.students.map(s => s.id === offer.studentId ? { ...s, placementStatus: 'SELECTED' } : s);

      this.notifications = [
        {
          id: `NOTIF-OFFER-VERIFIED-${Date.now()}`,
          studentId: offer.studentId,
          title: `Offer Letter Verified: ${offer.companyName}`,
          message: `Your offer from ${offer.companyName} for ${offer.role} (${offer.ctcLpa}) has been officially verified by CAR.`,
          category: 'PLACEMENT',
          origin: 'PLACEMENT_OFFICE',
          timestamp: 'Just now',
          isRead: false,
          actionRoute: '/student/offers'
        },
        ...this.notifications
      ];
    }

    this.logAction('Offer Verified', 'Offer', id, `Audited compensation & verified employment contract`);
    this.notify();
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): PlacementAnnouncement[] {
    return this.announcements;
  }

  public publishAnnouncement(announcement: PlacementAnnouncement) {
    this.announcements = [announcement, ...this.announcements];

    // Automatically emit notifications across student portal
    this.notifications = [
      {
        id: `NOTIF-ANN-${Date.now()}`,
        studentId: 'ALL',
        title: `Notice: ${announcement.title}`,
        message: announcement.content.slice(0, 140) + '...',
        category: 'ANNOUNCEMENT',
        origin: 'PLACEMENT_OFFICE',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: '/student'
      },
      ...this.notifications
    ];

    this.logAction('Announcement Published', 'Announcement', announcement.id, `Priority: ${announcement.priority}, Audience: ${announcement.targetAudience || 'ALL'}`);
    this.notify();
  }

  // --- SUPPORT TICKETS ---
  public getTickets(): SupportTicket[] {
    return this.tickets;
  }

  public replyTicket(id: string, adminResponse: string, newStatus: TicketStatus) {
    const officerName = this.currentRole === 'SUPER_ADMIN' ? 'Dr. S. Ranganathan (Head, CAR)' : 'Mr. Pradeep Kumar (Placement Officer)';
    const now = new Date();
    const dateFormatted = `${now.getDate()} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    this.tickets = this.tickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          adminResponse,
          status: newStatus,
          respondedAt: dateFormatted,
          assignedOfficer: officerName,
          updatedAt: dateFormatted
        };
      }
      return t;
    });

    const ticket = this.tickets.find(t => t.id === id);
    if (ticket) {
      this.notifications = [
        {
          id: `NOTIF-TICK-REPLY-${Date.now()}`,
          studentId: ticket.studentId,
          title: `Support Ticket Update: ${ticket.id}`,
          message: `The Placement Office has responded to your inquiry: "${ticket.subject}".`,
          category: 'SYSTEM',
          origin: 'PLACEMENT_OFFICE',
          timestamp: 'Just now',
          isRead: false,
          actionRoute: '/student/support'
        },
        ...this.notifications
      ];
    }

    this.logAction('Support Ticket Replied', 'SupportTicket', id, `Status set to ${newStatus}`);
    this.notify();
  }

  public assignTicket(id: string, officer: string) {
    this.tickets = this.tickets.map(t => t.id === id ? { ...t, assignedOfficer: officer } : t);
    this.logAction('Support Ticket Assigned', 'SupportTicket', id, `Assigned to ${officer}`);
    this.notify();
  }

  // --- POLICY SETTINGS ---
  public getPolicySettings(): PlacementPolicySettings {
    return this.policySettings;
  }

  public updatePolicySettings(updates: Partial<PlacementPolicySettings>) {
    this.policySettings = { ...this.policySettings, ...updates };
    this.logAction('Placement Policies Configured', 'Settings', undefined, `Updated criteria: ${Object.keys(updates).join(', ')}`);
    this.notify();
  }

  // --- EXISTING STUDENT PORTAL COMPATIBILITY ---
  public getNotifications(): PlacementNotification[] {
    return this.notifications;
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public getDocuments(): StudentDocument[] {
    return this.documents;
  }

  public getCalendarEvents(): PlacementCalendarEvent[] {
    return this.calendarEvents;
  }

  public applyToOpportunity(opportunityId: string): { success: boolean; applicationId?: string; message: string } {
    const student = this.getStudent();
    const existing = this.applications.find(a => a.opportunityId === opportunityId && a.studentId === student.id);
    if (existing) {
      return { success: false, message: 'You have already applied for this position.' };
    }

    const opp = this.opportunities.find(o => o.id === opportunityId);
    if (!opp) {
      return { success: false, message: 'Opportunity not found.' };
    }

    const newAppId = `APP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const dateFormatted = `${now.getDate()} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Find active resume
    const activeResume = this.documents.find(d => d.type === 'RESUME' && d.isActiveForApplications) || this.documents.find(d => d.type === 'RESUME');

    const newApplication: Application = {
      id: newAppId,
      studentId: student.id,
      opportunityId: opp.id,
      recruiterId: opp.recruiterId,
      placementDriveId: opp.driveDate ? 'DRIVE-2026-001' : undefined,
      companyName: opp.companyName,
      companyLogo: opp.companyLogo,
      role: opp.role,
      type: opp.type,
      location: opp.location,
      compensation: opp.ctcLpa,
      stage: 'APPLIED',
      submittedAt: dateFormatted,
      updatedAt: dateFormatted,
      resumeFileName: activeResume?.fileName || `${student.name.replace(/\s+/g, '_')}_Resume.pdf`,
      resumeDataUrl: activeResume?.fileDataUrl,
      resumeSize: activeResume?.fileSize || '380 KB',
      timeline: [
        { stage: 'APPLIED', label: 'Application Submitted', timestamp: `${now.getDate()} Sep 2026`, completed: true, active: false, remarks: 'Submitted to RVU Placement & Career Management System' },
        { stage: 'UNDER_REVIEW', label: 'CAR Verification & Profile Screening', timestamp: 'In Progress', completed: false, active: true, remarks: 'Awaiting recruiter review alongside CAR compliance check' }
      ],
      nextAction: {
        title: 'Application Under Initial Review',
        description: 'Your verified RV University academic profile and resume have been delivered to the recruiter.',
        deadline: 'Review window closes 3 days before drive'
      }
    };

    this.applications = [newApplication, ...this.applications];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      supabase.from('applications').insert({
        id: newAppId,
        student_id: student.id,
        opportunity_id: opp.id,
        stage: 'applied',
        resume_url: activeResume?.downloadUrl || null
      }).then(({ error }) => {
        if (error) console.error('Supabase application sync error:', error);
      });
    }

    this.notifications = [
      {
        id: `NOTIF-APP-${Date.now()}`,
        studentId: student.id,
        title: `Application Submitted: ${opp.role}`,
        message: `Your application (Ref: ${newAppId}) at ${opp.companyName} has been routed to the recruiter and CAR monitoring desk.`,
        category: 'APPLICATION',
        origin: 'SYSTEM',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/student/applications/${newAppId}`
      },
      ...this.notifications
    ];

    this.logAction('Application Submitted', 'Application', newAppId, `Student ${student.name} applied for ${opp.role} at ${opp.companyName}`);
    this.notify();
    return { success: true, applicationId: newAppId, message: 'Application submitted successfully.' };
  }

  public markNotificationRead(id: string) {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.notify();
  }

  public markAllNotificationsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.notify();
  }

  public createSupportTicket(subject: string, category: TicketCategory, description: string): SupportTicket {
    const student = this.getStudent();
    const ticketId = `TICK-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const dateFormatted = `${now.getDate()} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTicket: SupportTicket = {
      id: ticketId,
      studentId: student.id,
      studentName: student.name,
      subject,
      category,
      description,
      status: 'OPEN',
      createdAt: dateFormatted,
      updatedAt: dateFormatted
    };

    this.tickets = [newTicket, ...this.tickets];

    this.notifications = [
      {
        id: `NOTIF-TICK-${Date.now()}`,
        studentId: student.id,
        title: `Ticket Created: ${subject.slice(0, 30)}...`,
        message: `Ticket ${ticketId} has been logged with the CAR Placement Office.`,
        category: 'SYSTEM',
        origin: 'PLACEMENT_OFFICE',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: '/student/support'
      },
      ...this.notifications
    ];

    this.logAction('Ticket Submitted by Student', 'SupportTicket', ticketId, `Category: ${category} - ${subject}`);
    this.notify();
    return newTicket;
  }

  public uploadResume(fileName: string, fileSize: string, dataUrl?: string): StudentDocument {
    const student = this.getStudent();
    this.documents = this.documents.map(d => d.type === 'RESUME' ? { ...d, isActiveForApplications: false } : d);

    const newDoc: StudentDocument = {
      id: `DOC-${Date.now()}`,
      studentId: student.id,
      type: 'RESUME',
      title: 'Active Placement Resume (Uploaded)',
      fileName,
      fileSize,
      uploadedDate: `${new Date().getDate()} Sep 2026`,
      status: 'VERIFIED',
      isActiveForApplications: true,
      downloadUrl: '#',
      fileDataUrl: dataUrl
    };

    this.documents = [newDoc, ...this.documents];
    this.updateStudent(student.id, {
      readinessBreakdown: { ...student.readinessBreakdown, resume: 95 }
    });

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      const numBytes = parseInt(fileSize.replace(/[^0-9]/g, '')) * 1024 || 250000;
      supabase.from('student_documents').insert({
        id: newDoc.id,
        student_id: student.id,
        title: fileName,
        document_type: 'resume',
        file_url: dataUrl || '',
        file_size_bytes: numBytes,
        is_verified: true
      }).then(({ error }) => {
        if (error) console.error('Supabase resume upload sync error:', error);
      });
    }

    this.logAction('Resume Uploaded', 'StudentDocument', newDoc.id, `Uploaded ${fileName} for ${student.name}`);
    this.notify();
    return newDoc;
  }

  public uploadDocument(
    type: 'RESUME' | 'TRANSCRIPT' | 'CERTIFICATE' | 'PORTFOLIO' | 'GOVT_ID',
    title: string,
    fileName: string,
    fileSize: string,
    dataUrl?: string
  ): StudentDocument {
    const student = this.getStudent();
    if (type === 'RESUME') {
      this.documents = this.documents.map(d => d.type === 'RESUME' ? { ...d, isActiveForApplications: false } : d);
    }

    const newDoc: StudentDocument = {
      id: `DOC-${Date.now()}`,
      studentId: student.id,
      type,
      title,
      fileName,
      fileSize,
      uploadedDate: `${new Date().getDate()} Sep 2026`,
      status: 'VERIFIED',
      isActiveForApplications: type === 'RESUME',
      downloadUrl: '#',
      fileDataUrl: dataUrl
    };

    this.documents = [newDoc, ...this.documents];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      const numBytes = parseInt(fileSize.replace(/[^0-9]/g, '')) * 1024 || 250000;
      const docType = type === 'RESUME' ? 'resume' : type === 'TRANSCRIPT' ? 'transcript' : 'certificate';
      supabase.from('student_documents').insert({
        id: newDoc.id,
        student_id: student.id,
        title: fileName,
        document_type: docType,
        file_url: dataUrl || '',
        file_size_bytes: numBytes,
        is_verified: true
      }).then(({ error }) => {
        if (error) console.error('Supabase document upload sync error:', error);
      });
    }

    this.logAction('Document Uploaded', 'StudentDocument', newDoc.id, `Uploaded ${type}: ${fileName} for ${student.name}`);
    this.notify();
    return newDoc;
  }

  // --- STUDENT CAREER OS EXTENSIONS ---
  public getSavedOpportunityIds(): string[] {
    return this.savedOpportunityIds;
  }

  public isOpportunitySaved(oppId: string): boolean {
    return this.savedOpportunityIds.includes(oppId);
  }

  public toggleSaveOpportunity(oppId: string): void {
    if (this.savedOpportunityIds.includes(oppId)) {
      this.savedOpportunityIds = this.savedOpportunityIds.filter(id => id !== oppId);
      this.logAction('Opportunity Unsaved', 'Opportunity', oppId, `Student removed opportunity ${oppId} from saved list`);
    } else {
      this.savedOpportunityIds = [...this.savedOpportunityIds, oppId];
      this.logAction('Opportunity Saved', 'Opportunity', oppId, `Student saved opportunity ${oppId}`);
    }
    this.notify();
  }

  public getCompletedPreparationTaskIds(): string[] {
    return this.completedPreparationTaskIds;
  }

  public togglePreparationTask(taskId: string): void {
    if (this.completedPreparationTaskIds.includes(taskId)) {
      this.completedPreparationTaskIds = this.completedPreparationTaskIds.filter(id => id !== taskId);
    } else {
      this.completedPreparationTaskIds = [...this.completedPreparationTaskIds, taskId];
    }
    this.notify();
  }

  public registerForPlacementDrive(driveId: string): void {
    const drive = this.placementDrives.find(d => d.id === driveId);
    if (!drive) return;
    const student = this.getStudent();
    const existingRoster = drive.attendanceRoster || [];
    if (!existingRoster.some(r => r.studentId === student.id)) {
      drive.attendanceRoster = [
        ...existingRoster,
        {
          studentId: student.id,
          studentName: student.name,
          registeredAt: new Date().toLocaleDateString('en-GB'),
          attendanceStatus: 'REGISTERED'
        }
      ];
      this.logAction('Drive Registration', 'PlacementDrive', driveId, `Student ${student.name} registered for ${drive.title}`);
      this.notify();
    }
  }

  public deleteStudentDocument(docId: string): void {
    this.documents = this.documents.filter(d => d.id !== docId);
    this.logAction('Document Deleted', 'StudentDocument', docId, `Student deleted document ${docId}`);
    this.notify();
  }

  public replaceStudentDocument(docId: string, fileName: string, fileSize: string): void {
    this.documents = this.documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          fileName,
          fileSize,
          uploadedDate: new Date().toLocaleDateString('en-GB')
        };
      }
      return d;
    });
    this.logAction('Document Replaced', 'StudentDocument', docId, `Student updated document ${docId} with ${fileName}`);
    this.notify();
  }

  public updateStudentProfile(updates: Partial<Student>): void {
    const activeStudentId = 'RVU2023CSE042';
    this.students = this.students.map(s => {
      if (s.id === activeStudentId) {
        return { ...s, ...updates };
      }
      return s;
    });
    this.logAction('Profile Updated', 'Student', activeStudentId, 'Student updated personal profile details');
    this.notify();
  }

  public acceptOffer(offerId: string) {
    const student = this.getStudent();
    this.offers = this.offers.map(o => o.id === offerId ? { ...o, status: 'OFFER_ACCEPTED' } : o);
    this.updateStudent(student.id, { placementStatus: 'PLACED' });

    this.notifications = [
      {
        id: `NOTIF-OFFER-${Date.now()}`,
        studentId: student.id,
        title: 'Offer Accepted — Congratulations!',
        message: 'Your formal acceptance has been transmitted to CAR leadership and the employer partner.',
        category: 'PLACEMENT',
        origin: 'PLACEMENT_OFFICE',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: '/student/offers'
      },
      ...this.notifications
    ];

    this.logAction('Offer Accepted by Student', 'Offer', offerId, `Student ${student.name} accepted offer`);
    this.notify();
  }

  public declineOffer(offerId: string) {
    this.offers = this.offers.map(o => o.id === offerId ? { ...o, status: 'OFFER_DECLINED' } : o);
    this.logAction('Offer Declined by Student', 'Offer', offerId, 'Offer marked declined in placement records');
    this.notify();
  }

  // ==========================================
  // RECRUITER PORTAL WORKSPACE (RVU CORPORATE CONNECT)
  // ==========================================
  public getActiveRecruiterId(): string {
    return this.activeRecruiterId;
  }

  public setActiveRecruiterId(id: string) {
    this.activeRecruiterId = id;
    this.notify();
  }

  public getActiveRecruiter(): RecruiterAccount | undefined {
    return this.recruiters.find(r => r.id === this.activeRecruiterId) || this.recruiters[0];
  }

  public getActiveCompany(): CompanyRecord | undefined {
    const activeRec = this.getActiveRecruiter();
    if (!activeRec) return this.companies[0];
    return this.companies.find(c => c.id === activeRec.companyId || c.name === activeRec.companyName) || this.companies[0];
  }

  public getRecruiterRole(): RecruiterRole {
    return this.getActiveRecruiter()?.role || 'COMPANY_ADMIN';
  }

  public setRecruiterRole(role: RecruiterRole) {
    const active = this.getActiveRecruiter();
    if (active) {
      active.role = role;
      this.recruiters = [...this.recruiters];
      this.notify();
    }
  }

  public getOpportunitiesForActiveRecruiter(): Opportunity[] {
    const company = this.getActiveCompany();
    const recruiter = this.getActiveRecruiter();
    if (!company && !recruiter) return [];
    return this.opportunities.filter(o => 
      (company && o.companyId === company.id) ||
      (company && o.companyName.toLowerCase() === company.name.toLowerCase()) ||
      (recruiter && o.recruiterId === recruiter.id)
    );
  }

  public getApplicationsForActiveRecruiter(): Application[] {
    const opps = this.getOpportunitiesForActiveRecruiter();
    const oppIds = new Set(opps.map(o => o.id));
    const company = this.getActiveCompany();
    const recruiter = this.getActiveRecruiter();

    return this.applications.filter(app => 
      oppIds.has(app.opportunityId) ||
      (company && app.companyName.toLowerCase() === company.name.toLowerCase()) ||
      (recruiter && app.recruiterId === recruiter.id)
    );
  }

  public getCandidatesForActiveRecruiter(): Student[] {
    const apps = this.getApplicationsForActiveRecruiter();
    const company = this.getActiveCompany();
    const companyName = company?.name.toLowerCase() || '';

    // Collect candidate studentIds strictly scoped to this company
    const candidateIds = new Set<string>();
    apps.forEach(a => candidateIds.add(a.studentId));

    this.placementDrives.forEach(d => {
      if ((company && d.companyId === company.id) || d.companyName.toLowerCase() === companyName) {
        d.attendanceRoster?.forEach(r => candidateIds.add(r.studentId));
      }
    });

    this.interviews.forEach(i => {
      if ((company && i.companyId === company.id) || i.companyName.toLowerCase() === companyName) {
        candidateIds.add(i.studentId);
      }
    });

    this.offers.forEach(o => {
      if (o.companyName.toLowerCase() === companyName) {
        candidateIds.add(o.studentId);
      }
    });

    return this.students.filter(s => candidateIds.has(s.id));
  }

  public getInterviewsForActiveRecruiter(): InterviewScheduleItem[] {
    const company = this.getActiveCompany();
    const companyName = company?.name.toLowerCase() || '';
    return this.interviews.filter(i => 
      (company && i.companyId === company.id) || 
      i.companyName.toLowerCase() === companyName
    );
  }

  public getDrivesForActiveRecruiter(): PlacementDrive[] {
    const company = this.getActiveCompany();
    const companyName = company?.name.toLowerCase() || '';
    return this.placementDrives.filter(d => 
      (company && d.companyId === company.id) || 
      d.companyName.toLowerCase() === companyName
    );
  }

  public getOffersForActiveRecruiter(): Offer[] {
    const company = this.getActiveCompany();
    const companyName = company?.name.toLowerCase() || '';
    return this.offers.filter(o => o.companyName.toLowerCase() === companyName);
  }

  public getAssessmentsForActiveRecruiter(): RecruiterAssessment[] {
    const company = this.getActiveCompany();
    if (!company) return this.assessments;
    return this.assessments.filter(a => a.companyId === company.id);
  }

  public getRecruiterMessages(): RecruiterMessage[] {
    const company = this.getActiveCompany();
    if (!company) return this.recruiterMessages;
    return this.recruiterMessages.filter(m => m.companyId === company.id);
  }

  public getRecruiterNotifications(): RecruiterNotification[] {
    const company = this.getActiveCompany();
    if (!company) return this.recruiterNotifications;
    return this.recruiterNotifications.filter(n => n.companyId === company.id);
  }

  public createRecruiterOpportunity(oppData: Partial<Opportunity>): Opportunity {
    const company = this.getActiveCompany();
    const recruiter = this.getActiveRecruiter();
    const id = `OPP-2026-${String(this.opportunities.length + 1).padStart(3, '0')}`;
    
    const newOpp: Opportunity = {
      id,
      recruiterId: recruiter?.id || 'REC-001',
      companyId: company?.id || 'COMP-001',
      companyName: company?.name || 'Hiring Partner',
      companyLogo: company?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
      role: oppData.role || 'Software Development Engineer',
      type: oppData.type || 'Placement',
      location: oppData.location || 'Bengaluru',
      workMode: oppData.workMode || 'Hybrid',
      ctcLpa: oppData.ctcLpa || '₹12.0 - ₹16.0 LPA',
      stipendPerMonth: oppData.stipendPerMonth,
      department: oppData.department || 'Engineering',
      jobFunction: oppData.jobFunction || 'Technology',
      otherBenefits: oppData.otherBenefits,
      lifecycleState: 'SUBMITTED',
      isPublished: false,
      approvedByAdmin: false,
      eligibleSchools: oppData.eligibleSchools || ['School of Computer Science & Engineering'],
      eligibleProgrammes: oppData.eligibleProgrammes || ['B.Tech (Hons.) Computer Science & Engineering'],
      eligibleGraduationYears: oppData.eligibleGraduationYears || [2027],
      minCgpa: oppData.minCgpa ?? 7.0,
      maxBacklogsAllowed: oppData.maxBacklogsAllowed ?? 0,
      requiredSkills: oppData.requiredSkills || ['Problem Solving', 'Data Structures'],
      niceToHaveSkills: oppData.niceToHaveSkills || [],
      description: oppData.description || 'Exciting career opportunity at ' + (company?.name || 'RVU Partner Company'),
      responsibilities: oppData.responsibilities || ['Build next generation software systems.'],
      selectionProcess: oppData.selectionProcess || [
        { roundNumber: 1, title: 'CAR Screening', mode: 'Online', description: 'Institutional Verification' },
        { roundNumber: 2, title: 'Technical Assessment', mode: 'Online', description: 'Coding & Aptitude Test' },
        { roundNumber: 3, title: 'Technical Interview', mode: 'In-person', description: 'On-Campus or Virtual Interview' }
      ],
      applicationDeadline: oppData.applicationDeadline || '15 Oct 2026',
      driveDate: oppData.driveDate || '20 Oct 2026',
      openingsCount: oppData.openingsCount ?? 5,
      timeline: oppData.timeline || {
        openingDate: '10 Sep 2026',
        deadline: oppData.applicationDeadline || '15 Oct 2026',
        assessmentDate: '18 Oct 2026',
        interviewWindow: '20 Oct - 22 Oct 2026',
        expectedOfferDate: '25 Oct 2026'
      },
      carReviewComments: 'Submitted by recruiter. Pending CAR Placement Director review and school cohort allotment.'
    };

    this.opportunities = [newOpp, ...this.opportunities];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      const roleType = newOpp.type === 'Internship' ? 'internship' : newOpp.type === 'Placement' ? 'full-time' : 'both';
      supabase.from('opportunities').insert({
        id: newOpp.id,
        company_id: newOpp.companyId || 'comp-1',
        title: newOpp.role,
        role_type: roleType,
        description: newOpp.description || '',
        ctc_range: newOpp.ctcLpa,
        min_cgpa: newOpp.minCgpa || 6.0,
        status: 'pending_approval',
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        created_by: newOpp.recruiterId || 'system'
      }).then(({ error }) => {
        if (error) console.error('Supabase opportunity sync error:', error);
      });
    }

    this.logAction('Opportunity Submitted by Recruiter', 'Opportunity', id, `Recruiter submitted ${newOpp.role} for CAR approval`);
    
    this.recruiterNotifications = [
      {
        id: `RNOTIF-${Date.now()}`,
        companyId: newOpp.companyId,
        recruiterId: newOpp.recruiterId,
        title: 'Opportunity Submitted to CAR',
        message: `"${newOpp.role}" has been submitted and is awaiting CAR Placement Office review.`,
        type: 'OPPORTUNITY_STATUS',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/recruiter/opportunities/${newOpp.id}`
      },
      ...this.recruiterNotifications
    ];

    this.notify();
    return newOpp;
  }

  public updateRecruiterOpportunity(id: string, updates: Partial<Opportunity>) {
    this.opportunities = this.opportunities.map(o => o.id === id ? { ...o, ...updates } : o);
    this.logAction('Opportunity Updated by Recruiter', 'Opportunity', id, 'Recruiter updated job posting details');
    this.notify();
  }

  public advanceApplicationStage(applicationId: string, nextStage: ApplicationStage, remarks?: string) {
    this.updateApplicationStage(applicationId, nextStage, remarks);
  }

  public bulkAdvanceApplications(applicationIds: string[], nextStage: ApplicationStage, remarks?: string) {
    applicationIds.forEach(id => this.updateApplicationStage(id, nextStage, remarks));
  }

  public scheduleRecruiterAssessment(assessmentData: Omit<RecruiterAssessment, 'id' | 'companyId'>): RecruiterAssessment {
    const company = this.getActiveCompany();
    const id = `ASSESS-2026-${String(this.assessments.length + 1).padStart(3, '0')}`;
    const newAssessment: RecruiterAssessment = {
      id,
      companyId: company?.id || 'COMP-001',
      ...assessmentData
    };

    this.assessments = [newAssessment, ...this.assessments];
    const cutoff = newAssessment.passThresholdScore ?? newAssessment.passingMarks ?? 70;
    this.logAction('Assessment Scheduled', 'Assessment', id, `Recruiter configured ${newAssessment.title} with cut-off ${cutoff}%`);
    this.notify();
    return newAssessment;
  }

  public evaluateAssessmentCandidate(assessmentId: string, candidateId: string, score: number, feedback: string) {
    this.assessments = this.assessments.map(a => {
      if (a.id === assessmentId) {
        const updatedCandidates = (a.candidates || []).map(c => {
          if (c.studentId === candidateId || c.applicationId === candidateId) {
            return {
              ...c,
              score,
              feedback,
              status: 'EVALUATED' as const,
              submittedAt: new Date().toISOString()
            };
          }
          return c;
        });

        const updatedResults = [
          ...(a.candidateResults || []).filter(r => r.candidateId !== candidateId),
          {
            candidateId,
            candidateName: updatedCandidates.find(c => c.studentId === candidateId)?.studentName || 'Candidate',
            score,
            maxScore: a.totalMarks || 100,
            result: score >= (a.passThresholdScore || a.passingMarks || 60) ? ('Passed' as const) : ('Failed' as const),
            completedAt: new Date().toISOString(),
            evaluationNotes: feedback
          }
        ];

        return {
          ...a,
          candidates: updatedCandidates,
          candidateResults: updatedResults
        };
      }
      return a;
    });

    this.logAction('Assessment Candidate Evaluated', 'Assessment', assessmentId, `Candidate ${candidateId} scored ${score}%`);
    this.notify();
  }

  public evaluateInterview(interviewId: string, evaluation: NonNullable<InterviewScheduleItem['evaluation']>) {
    this.interviews = this.interviews.map(item => {
      if (item.id === interviewId) {
        return {
          ...item,
          status: 'COMPLETED',
          evaluation
        };
      }
      return item;
    });

    this.logAction('Interview Evaluated', 'Interview', interviewId, `Interview evaluation submitted with recommendation: ${evaluation.recommendation}`);
    this.notify();
  }

  public scheduleRecruiterInterview(itemData: Omit<InterviewScheduleItem, 'id' | 'companyId' | 'companyName'>): InterviewScheduleItem {
    const company = this.getActiveCompany();
    const id = `INT-2026-${String(this.interviews.length + 1).padStart(3, '0')}`;
    const newInterview: InterviewScheduleItem = {
      id,
      companyId: company?.id || 'COMP-001',
      companyName: company?.name || 'Hiring Partner',
      ...itemData
    };

    this.interviews = [newInterview, ...this.interviews];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      supabase.from('interview_schedules').insert({
        id,
        application_id: newInterview.applicationId,
        round_number: newInterview.roundNumber || 1,
        round_title: newInterview.roundTitle || 'Round ' + newInterview.roundNumber,
        scheduled_at: new Date().toISOString(),
        meeting_link: newInterview.venueOrLink.toLowerCase().includes('http') ? newInterview.venueOrLink : null,
        interviewer_name: newInterview.interviewerName || null,
        status: 'scheduled'
      }).then(({ error }) => {
        if (error) console.error('Supabase interview sync error:', error);
      });
    }

    this.notifications = [
      {
        id: `NOTIF-${Date.now()}`,
        studentId: newInterview.studentId,
        title: `Interview Scheduled: ${newInterview.companyName}`,
        message: `Round ${newInterview.roundNumber} (${newInterview.roundTitle}) scheduled for ${newInterview.date} at ${newInterview.timeSlot}. Venue: ${newInterview.venueOrLink}`,
        category: 'INTERVIEW',
        origin: 'RECRUITER',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/student/applications/${newInterview.applicationId}`
      },
      ...this.notifications
    ];

    this.logAction('Interview Scheduled', 'Interview', id, `Recruiter scheduled interview with ${newInterview.studentName}`);
    this.notify();
    return newInterview;
  }

  public createRecruiterOffer(offerData: {
    studentId: string;
    applicationId: string;
    role: string;
    ctcLpa: string;
    baseSalary?: string;
    joiningBonus?: string;
    stockOptions?: string;
    location: string;
    joiningDate: string;
    acceptanceDeadline: string;
    termsSummary?: string[];
  }): Offer {
    const company = this.getActiveCompany();
    const student = this.students.find(s => s.id === offerData.studentId);
    const id = `OFFER-2026-${String(this.offers.length + 1).padStart(3, '0')}`;

    const newOffer: Offer = {
      id,
      applicationId: offerData.applicationId,
      studentId: offerData.studentId,
      studentName: student?.name || 'RVU Candidate',
      companyId: company?.id || 'COMP-001',
      companyName: company?.name || 'Hiring Partner',
      companyLogo: company?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
      role: offerData.role,
      ctcLpa: offerData.ctcLpa,
      baseSalary: offerData.baseSalary || offerData.ctcLpa,
      joiningBonus: offerData.joiningBonus,
      stockOptions: offerData.stockOptions,
      location: offerData.location,
      offerDate: `${new Date().getDate()} Sep 2026`,
      acceptanceDeadline: offerData.acceptanceDeadline,
      joiningDate: offerData.joiningDate,
      status: 'OFFER_RECEIVED',
      offerLetterUrl: '#',
      termsSummary: offerData.termsSummary || [
        'Full-time placement offer submitted by corporate partner.',
        'Subject to final CAR verification and transcript validation.'
      ],
      placementOfficeVerified: false
    };

    this.offers = [newOffer, ...this.offers];

    // Persist to Supabase Database
    if (isSupabaseConfigured() && supabase) {
      const ctcNum = parseFloat(newOffer.ctcLpa.replace(/[^0-9.]/g, '')) || 0;
      supabase.from('offers').insert({
        id,
        application_id: newOffer.applicationId,
        student_id: newOffer.studentId,
        company_id: newOffer.companyId || company?.id || 'COMP-001',
        ctc_annual: ctcNum,
        designation: newOffer.role,
        status: 'extended',
        offer_letter_url: newOffer.offerLetterUrl || null
      }).then(({ error }) => {
        if (error) console.error('Supabase offer sync error:', error);
      });
    }

    this.updateApplicationStage(offerData.applicationId, 'OFFER', 'Offer extended by recruiter (pending CAR formal audit)');
    this.logAction('Offer Issued by Recruiter', 'Offer', id, `Recruiter issued offer of ${offerData.ctcLpa} to ${newOffer.studentName}. Pending CAR verification.`);

    this.recruiterNotifications = [
      {
        id: `RNOTIF-${Date.now()}`,
        companyId: company?.id || 'COMP-001',
        recruiterId: this.activeRecruiterId,
        title: 'Offer Submitted for Verification',
        message: `Offer of ${offerData.ctcLpa} issued to ${newOffer.studentName} is awaiting CAR audit verification.`,
        type: 'OFFER_STATUS',
        timestamp: 'Just now',
        isRead: false,
        actionRoute: `/recruiter/offers/${newOffer.id}`
      },
      ...this.recruiterNotifications
    ];

    this.notify();
    return newOffer;
  }

  public sendRecruiterMessage(msgData: {
    receiverType: 'CAR' | 'CANDIDATE' | 'TEAM';
    receiverId: string;
    receiverName: string;
    subject: string;
    content: string;
    isUrgent?: boolean;
  }): RecruiterMessage {
    const company = this.getActiveCompany();
    const recruiter = this.getActiveRecruiter();
    const id = `RMSG-${Date.now()}`;

    const newMsg: RecruiterMessage = {
      id,
      companyId: company?.id || 'COMP-001',
      senderId: recruiter?.id || 'REC-001',
      senderName: recruiter?.name || 'Recruiter',
      senderRole: recruiter?.role || 'COMPANY_ADMIN',
      receiverType: msgData.receiverType,
      receiverId: msgData.receiverId,
      receiverName: msgData.receiverName,
      subject: msgData.subject,
      content: msgData.content,
      timestamp: 'Just now',
      isRead: false,
      isUrgent: msgData.isUrgent || false
    };

    this.recruiterMessages = [newMsg, ...this.recruiterMessages];

    if (msgData.receiverType === 'CANDIDATE') {
      this.notifications = [
        {
          id: `NOTIF-${Date.now()}`,
          studentId: msgData.receiverId,
          title: `Direct Message from ${company?.name}: ${msgData.subject}`,
          message: msgData.content.slice(0, 140) + '...',
          category: 'ANNOUNCEMENT',
          origin: 'RECRUITER',
          timestamp: 'Just now',
          isRead: false,
          actionRoute: '/student'
        },
        ...this.notifications
      ];
    }

    this.logAction('Recruiter Message Sent', 'Communication', id, `Message sent to ${msgData.receiverName} (${msgData.receiverType})`);
    this.notify();
    return newMsg;
  }

  public markRecruiterNotificationRead(id: string) {
    this.recruiterNotifications = this.recruiterNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.notify();
  }

  public markAllRecruiterNotificationsRead() {
    this.recruiterNotifications = this.recruiterNotifications.map(n => ({ ...n, isRead: true }));
    this.notify();
  }

  public inviteTeamMember(member: { name: string; email: string; role: RecruiterRole; department: string; designation: string }) {
    const company = this.getActiveCompany();
    const id = `REC-${Date.now().toString().slice(-4)}`;
    const newRecruiter: RecruiterAccount = {
      id,
      companyId: company?.id || 'COMP-001',
      companyName: company?.name || 'Hiring Partner',
      name: member.name,
      email: member.email,
      phone: '+91 98000 00000',
      designation: member.designation,
      verificationStatus: 'VERIFIED',
      role: member.role,
      department: member.department,
      status: 'INVITED'
    };

    this.recruiters = [...this.recruiters, newRecruiter];
    this.logAction('Recruiter Invited', 'Recruiter', id, `Team member ${member.name} (${member.role}) invited to ${company?.name}`);
    this.notify();
    return newRecruiter;
  }

  public updateRecruiterProfile(updates: Partial<RecruiterAccount>) {
    this.recruiters = this.recruiters.map(r => r.id === this.activeRecruiterId ? { ...r, ...updates } : r);
    this.logAction('Recruiter Profile Updated', 'Recruiter', this.activeRecruiterId, 'Recruiter updated personal contact profile');
    this.notify();
  }

  public updateCompanyProfile(updates: Partial<CompanyRecord>) {
    const company = this.getActiveCompany();
    if (!company) return;
    this.companies = this.companies.map(c => c.id === company.id ? { ...c, ...updates } : c);
    this.logAction('Company Profile Updated', 'Company', company.id, 'Recruiter updated organization profile & overview');
    this.notify();
  }
}

export const platformStore = new PlatformStore();
// Export as studentStore as well for backwards compatibility with existing Student components
export const studentStore = platformStore;

// Universal hook for both Student and Management views
export function usePlatformStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Proactively fetch live production data from Supabase Postgres Database tables
    platformStore.loadFromDatabase();

    const unsubscribe = platformStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    // Live Database Sync State
    isDatabaseLoaded: platformStore.isDatabaseLoaded(),
    isDatabaseLoading: platformStore.isDatabaseLoading(),
    refreshFromDatabase: () => platformStore.loadFromDatabase(),
    loadFromDatabase: () => platformStore.loadFromDatabase(),

    // Session & Role
    currentRole: platformStore.getCurrentRole(),
    setCurrentRole: (r: UserRole) => platformStore.setCurrentRole(r),

    // Students
    students: platformStore.getStudents(),
    student: platformStore.getStudent(),
    getStudent: (email?: string) => platformStore.getStudent(email),
    getStudentById: (id: string) => platformStore.getStudentById(id),
    addStudent: (s: Student) => platformStore.addStudent(s),
    updateStudent: (id: string, u: Partial<Student>) => platformStore.updateStudent(id, u),
    deactivateStudent: (id: string, reason?: string) => platformStore.deactivateStudent(id, reason),
    restoreStudent: (id: string) => platformStore.restoreStudent(id),
    bulkUpdateEligibility: (ids: string[], status: EligibilityStatus, remarks: string) => platformStore.bulkUpdateEligibility(ids, status, remarks),
    bulkAssignDrive: (ids: string[], driveId: string) => platformStore.bulkAssignDrive(ids, driveId),

    // Excel Import
    importHistory: platformStore.getImportHistory(),
    commitExcelImport: (records: Partial<Student>[], strategy: 'add_and_update' | 'skip_existing', fileMeta: { name: string; size: string }) => platformStore.commitExcelImport(records, strategy, fileMeta),

    // Recruiters & Companies
    recruiters: platformStore.getRecruiters(),
    companies: platformStore.getCompanies(),
    verifyRecruiter: (id: string) => platformStore.verifyRecruiter(id),
    suspendRecruiter: (id: string) => platformStore.suspendRecruiter(id),
    verifyCompany: (id: string) => platformStore.verifyCompany(id),
    addCompany: (c: CompanyRecord) => platformStore.addCompany(c),

    // Opportunities
    opportunities: platformStore.getOpportunities(),
    getOpportunityById: (id: string) => platformStore.getOpportunityById(id),
    approveOpportunity: (id: string) => platformStore.approveOpportunity(id),
    rejectOpportunity: (id: string, reason: string) => platformStore.rejectOpportunity(id, reason),

    // Drives
    placementDrives: platformStore.getPlacementDrives(),
    drives: platformStore.getPlacementDrives(),
    getPlacementDriveById: (id: string) => platformStore.getPlacementDriveById(id),
    createPlacementDrive: (d: PlacementDrive) => platformStore.createPlacementDrive(d),
    addPlacementDrive: (d: PlacementDrive) => platformStore.createPlacementDrive(d),
    updatePlacementDrive: (id: string, u: Partial<PlacementDrive>) => platformStore.updatePlacementDrive(id, u),
    updateDriveAttendance: (dId: string, sId: string, st: any) => platformStore.updateDriveAttendance(dId, sId, st),
    markDriveAttendance: (dId: string, sId: string, present: boolean) => platformStore.updateDriveAttendance(dId, sId, present ? 'PRESENT' : 'ABSENT'),

    // Applications
    applications: platformStore.getApplications(),
    getApplicationById: (id: string) => platformStore.getApplicationById(id),
    updateApplicationStage: (id: string, st: ApplicationStage, rem?: string) => platformStore.updateApplicationStage(id, st, rem),
    applyToOpportunity: (id: string) => platformStore.applyToOpportunity(id),

    // Interviews
    interviews: platformStore.getInterviews(),
    scheduleInterview: (item: InterviewScheduleItem) => platformStore.scheduleInterview(item),
    rescheduleInterview: (id: string, d: string, t: string, m: any, v: string) => platformStore.rescheduleInterview(id, d, t, m, v),
    updateInterviewStatus: (id: string, _st: any) => platformStore.rescheduleInterview(id, '', '', 'In-person', ''),

    // Offers
    offers: platformStore.getOffers(),
    verifyOffer: (id: string, _st?: any, _rem?: any) => platformStore.verifyOffer(id),
    acceptOffer: (id: string) => platformStore.acceptOffer(id),
    declineOffer: (id: string) => platformStore.declineOffer(id),

    // Communications & Announcements
    announcements: platformStore.getAnnouncements(),
    publishAnnouncement: (a: any) => platformStore.publishAnnouncement({
      id: `ANN-${Date.now()}`,
      title: a.title,
      content: a.content,
      priority: a.urgency === 'URGENT' || a.urgency === 'MANDATORY' ? 'URGENT' : 'NORMAL',
      category: a.category || 'General',
      targetAudience: a.targetSchool || 'ALL',
      publishedDate: 'Just now',
      publishedBy: a.author || 'Office of CAR',
      isMandatory: a.urgency === 'MANDATORY'
    }),
    notifications: platformStore.getNotifications(),
    unreadNotificationsCount: platformStore.getUnreadNotificationCount(),
    markNotificationRead: (id: string) => platformStore.markNotificationRead(id),
    markAllNotificationsRead: () => platformStore.markAllNotificationsRead(),

    // Support
    tickets: platformStore.getTickets(),
    createSupportTicket: (subj: string, cat: TicketCategory, desc: string) => platformStore.createSupportTicket(subj, cat, desc),
    replyTicket: (id: string, resp: string, st: TicketStatus) => platformStore.replyTicket(id, resp, st),
    replySupportTicket: (id: string, resp: string, _from?: string) => platformStore.replyTicket(id, resp, 'RESOLVED'),
    assignTicket: (id: string, off: string) => platformStore.assignTicket(id, off),

    // Documents & Calendar
    documents: platformStore.getDocuments(),
    uploadResume: (fName: string, fSize: string, dataUrl?: string) => platformStore.uploadResume(fName, fSize, dataUrl),
    uploadDocument: (type: any, title: string, fName: string, fSize: string, dataUrl?: string) => platformStore.uploadDocument(type, title, fName, fSize, dataUrl),
    deleteStudentDocument: (id: string) => platformStore.deleteStudentDocument(id),
    replaceStudentDocument: (id: string, name: string, size: string) => platformStore.replaceStudentDocument(id, name, size),
    calendarEvents: platformStore.getCalendarEvents(),

    // Student Career Operating System Additions
    savedOpportunityIds: platformStore.getSavedOpportunityIds(),
    isOpportunitySaved: (id: string) => platformStore.isOpportunitySaved(id),
    toggleSaveOpportunity: (id: string) => platformStore.toggleSaveOpportunity(id),
    completedPreparationTaskIds: platformStore.getCompletedPreparationTaskIds(),
    togglePreparationTask: (id: string) => platformStore.togglePreparationTask(id),
    registerForPlacementDrive: (id: string) => platformStore.registerForPlacementDrive(id),
    updateStudentProfile: (u: Partial<Student>) => platformStore.updateStudentProfile(u),

    // Audit & Policies
    auditLogs: platformStore.getAuditLogs(),
    policySettings: platformStore.getPolicySettings(),
    updatePolicySettings: (u: Partial<PlacementPolicySettings>) => platformStore.updatePolicySettings(u),

    // Convenience Bulk & Import methods
    bulkUpdatePlacementStatus: (ids: string[], status: any) => {
      ids.forEach(id => platformStore.updateStudent(id, { placementStatus: status }));
    },
    commitStudentImport: (students: any[], meta: any) => {
      const res = platformStore.commitExcelImport(
        students,
        meta.duplicateStrategy === 'SKIP_EXISTING' ? 'skip_existing' : 'add_and_update',
        { name: meta.fileName, size: `${meta.totalRecords} records` }
      );
      return { batchId: `IMP-2026-${Date.now().toString().slice(-4)}`, ...res };
    },
    approveRecruiter: (id: string, st: any) => {
      if (st === 'SUSPENDED') platformStore.suspendRecruiter(id);
      else platformStore.verifyRecruiter(id);
    },
    updateOpportunityStatus: (id: string, st: any) => {
      if (st === 'PUBLISHED') platformStore.approveOpportunity(id);
      else platformStore.rejectOpportunity(id, 'Archived by placement admin');
    },

    // Recruiter Portal Workspace (RVU CORPORATE CONNECT)
    activeRecruiterId: platformStore.getActiveRecruiterId(),
    activeRecruiter: platformStore.getActiveRecruiter(),
    activeCompany: platformStore.getActiveCompany(),
    recruiterRole: platformStore.getRecruiterRole(),
    setActiveRecruiterId: (id: string) => platformStore.setActiveRecruiterId(id),
    setRecruiterRole: (role: RecruiterRole) => platformStore.setRecruiterRole(role),
    recruiterOpportunities: platformStore.getOpportunitiesForActiveRecruiter(),
    recruiterApplications: platformStore.getApplicationsForActiveRecruiter(),
    recruiterCandidates: platformStore.getCandidatesForActiveRecruiter(),
    recruiterInterviews: platformStore.getInterviewsForActiveRecruiter(),
    recruiterDrives: platformStore.getDrivesForActiveRecruiter(),
    recruiterOffers: platformStore.getOffersForActiveRecruiter(),
    recruiterAssessments: platformStore.getAssessmentsForActiveRecruiter(),
    recruiterMessages: platformStore.getRecruiterMessages(),
    recruiterNotifications: platformStore.getRecruiterNotifications(),
    unreadRecruiterNotificationsCount: platformStore.getRecruiterNotifications().filter(n => !n.isRead).length,

    createRecruiterOpportunity: (opp: Partial<Opportunity>) => platformStore.createRecruiterOpportunity(opp),
    updateRecruiterOpportunity: (id: string, updates: Partial<Opportunity>) => platformStore.updateRecruiterOpportunity(id, updates),
    advanceApplicationStage: (id: string, next: ApplicationStage, rem?: string) => platformStore.advanceApplicationStage(id, next, rem),
    bulkAdvanceApplications: (ids: string[], next: ApplicationStage, rem?: string) => platformStore.bulkAdvanceApplications(ids, next, rem),
    scheduleRecruiterAssessment: (assess: Omit<RecruiterAssessment, 'id' | 'companyId'>) => platformStore.scheduleRecruiterAssessment(assess),
    evaluateAssessmentCandidate: (assessId: string, cId: string, score: number, fb: string) => platformStore.evaluateAssessmentCandidate(assessId, cId, score, fb),
    evaluateInterview: (intId: string, evalData: NonNullable<InterviewScheduleItem['evaluation']>) => platformStore.evaluateInterview(intId, evalData),
    scheduleRecruiterInterview: (item: Omit<InterviewScheduleItem, 'id' | 'companyId' | 'companyName'>) => platformStore.scheduleRecruiterInterview(item),
    createRecruiterOffer: (off: Parameters<PlatformStore['createRecruiterOffer']>[0]) => platformStore.createRecruiterOffer(off),
    sendRecruiterMessage: (msg: Parameters<PlatformStore['sendRecruiterMessage']>[0]) => platformStore.sendRecruiterMessage(msg),
    markRecruiterNotificationRead: (id: string) => platformStore.markRecruiterNotificationRead(id),
    markAllRecruiterNotificationsRead: () => platformStore.markAllRecruiterNotificationsRead(),
    inviteTeamMember: (m: Parameters<PlatformStore['inviteTeamMember']>[0]) => platformStore.inviteTeamMember(m),
    updateRecruiterProfile: (u: Partial<RecruiterAccount>) => platformStore.updateRecruiterProfile(u),
    updateCompanyProfile: (u: Partial<CompanyRecord>) => platformStore.updateCompanyProfile(u)
  };
}

export type PlatformStoreState = ReturnType<typeof usePlatformStore>;

// Preserve existing hook alias
export const useStudentStore = usePlatformStore;

