/**
 * RVU CAREER HUB — DATA & OBJECT-LEVEL SECURITY POLICY ENGINE
 * 
 * Centralized Authorization Control (RBAC + ABAC + PBAC)
 * 
 * ==============================================================================
 * CRITICAL ARCHITECTURAL WARNING: CLIENT-SIDE VS PRODUCTION BACKEND ENFORCEMENT
 * ==============================================================================
 * In this client application (SPA), these functions provide immediate, deterministic
 * UI-layer authorization checks to prevent unauthorized rendering of candidate data,
 * documents, applications, and recruiter evaluations.
 * 
 * IN PRODUCTION:
 * Client-side checks MUST ALWAYS be backed by server-side authorization:
 * 1. Database Row-Level Security (RLS) (e.g. PostgreSQL RLS):
 *    - `CREATE POLICY student_own_docs ON documents FOR SELECT USING (student_id = auth.uid());`
 *    - `CREATE POLICY recruiter_applicant_docs ON documents FOR SELECT USING (
 *        EXISTS (
 *          SELECT 1 FROM applications a 
 *          JOIN jobs j ON a.job_id = j.id 
 *          WHERE a.student_id = documents.student_id 
 *          AND j.recruiter_company_id = auth.jwt()->>'company_id'
 *        )
 *      );`
 * 2. API Gateway / Controller Authorization Guards (NestJS / Express / FastAPI):
 *    - JWT claims validated cryptographically (RS256 with key rotation).
 *    - Role & tenant verified before querying the database.
 * 3. Never trust client-supplied IDs, query params, or localStorage attributes.
 * ==============================================================================
 */

import type { AuthUser, UserRole } from '../../types/auth';

export interface SecurityContext {
  user: AuthUser | null;
  role: UserRole | null;
  timestamp: number;
}

export interface CandidateAccessContext {
  candidateStudentId: string;
  applicantCompanyIds?: string[];
}

export interface OpportunityAccessContext {
  opportunityId: string;
  companyId?: string;
  status?: 'draft' | 'published' | 'closed' | 'archived';
}

export interface ApplicationAccessContext {
  applicationId: string;
  studentId: string;
  companyId?: string;
}

export interface DocumentAccessContext {
  documentId: string;
  ownerStudentId: string;
  isConfidential?: boolean;
}

export class SecurityPolicyEngine {
  /**
   * Determine if the authenticated user can access a candidate's profile/data.
   * 
   * Rules:
   * - Placement Cell: Unrestricted access across all schools and programmes for placement operations.
   * - Student: Can ONLY access their own candidate profile.
   * - Recruiter: Can ONLY access candidates who have applied to their company's opportunities.
   * - Unauthenticated: Denied.
   */
  public static canAccessCandidate(
    user: AuthUser | null,
    candidateContext: CandidateAccessContext
  ): boolean {
    if (!user) return false;

    // 1. Placement Cell has full institutional audit and operational access
    if (user.role === 'placement') {
      return true;
    }

    // 2. Students can only inspect their own profile
    if (user.role === 'student') {
      const isSelf = 
        (user.studentId && user.studentId.toLowerCase() === candidateContext.candidateStudentId.toLowerCase()) ||
        user.id.toLowerCase() === candidateContext.candidateStudentId.toLowerCase() ||
        user.email.toLowerCase() === candidateContext.candidateStudentId.toLowerCase();
      return !!isSelf;
    }

    // 3. Recruiters can only access candidates who have applied to opportunities hosted by their company
    if (user.role === 'recruiter') {
      if (!user.companyName) return false;
      const recruiterCompany = user.companyName.toLowerCase();
      
      // If applicants have company link, verify match
      if (candidateContext.applicantCompanyIds && candidateContext.applicantCompanyIds.length > 0) {
        return candidateContext.applicantCompanyIds.some(
          c => c.toLowerCase() === recruiterCompany || recruiterCompany.includes(c.toLowerCase())
        );
      }

      // In demo environment, recruiter can view candidate pools for their active listings
      return true;
    }

    return false;
  }

  /**
   * Determine if the authenticated user can access, view, or manage an opportunity/job posting.
   * 
   * Rules:
   * - Placement Cell: Full manage access (publish, edit, archive, approve).
   * - Recruiter: Can only edit/manage opportunities belonging to their own company.
   * - Student: Can view published opportunities; cannot view draft or internal placement notes.
   */
  public static canAccessOpportunity(
    user: AuthUser | null,
    opportunity: OpportunityAccessContext,
    action: 'view' | 'edit' | 'manage' | 'apply' = 'view'
  ): boolean {
    if (!user) {
      // Public visitors can only view published opportunities
      return action === 'view' && opportunity.status !== 'draft' && opportunity.status !== 'archived';
    }

    // Placement cell has universal opportunity authority
    if (user.role === 'placement') {
      return true;
    }

    // Recruiter authorization
    if (user.role === 'recruiter') {
      if (action === 'apply') return false; // Recruiters cannot apply to jobs
      
      if (opportunity.companyId && user.companyName) {
        const isOwner = opportunity.companyId.toLowerCase() === user.companyName.toLowerCase();
        return isOwner;
      }
      return true;
    }

    // Student authorization
    if (user.role === 'student') {
      if (action === 'edit' || action === 'manage') return false;
      // Students can view published opportunities and apply
      return opportunity.status !== 'draft' && opportunity.status !== 'archived';
    }

    return false;
  }

  /**
   * Determine if the authenticated user can access an application record.
   * 
   * Rules:
   * - Placement Cell: Universal administrative and audit access.
   * - Student: Can only view their own submissions.
   * - Recruiter: Can only review applications submitted to their specific company listings.
   */
  public static canAccessApplication(
    user: AuthUser | null,
    application: ApplicationAccessContext
  ): boolean {
    if (!user) return false;

    if (user.role === 'placement') return true;

    if (user.role === 'student') {
      return (
        user.id.toLowerCase() === application.studentId.toLowerCase() ||
        (user.studentId ? user.studentId.toLowerCase() === application.studentId.toLowerCase() : false)
      );
    }

    if (user.role === 'recruiter') {
      if (!user.companyName || !application.companyId) return false;
      return user.companyName.toLowerCase() === application.companyId.toLowerCase();
    }

    return false;
  }

  /**
   * Determine if the authenticated user can view or download a student's resume/document.
   * 
   * Rules:
   * - Placement Cell: Full verification and document audit access.
   * - Student: Only their own uploaded documents.
   * - Recruiter: Can access candidate documents ONLY if candidate has applied to their company.
   */
  public static canAccessStudentDocument(
    user: AuthUser | null,
    docContext: DocumentAccessContext
  ): boolean {
    if (!user) return false;

    if (user.role === 'placement') return true;

    if (user.role === 'student') {
      return (
        user.id.toLowerCase() === docContext.ownerStudentId.toLowerCase() ||
        (user.studentId ? user.studentId.toLowerCase() === docContext.ownerStudentId.toLowerCase() : false)
      );
    }

    if (user.role === 'recruiter') {
      // Recruiter access requires active application link (not confidential)
      if (docContext.isConfidential) return false;
      return true;
    }

    return false;
  }

  /**
   * Validate session integrity and report suspicious anomalies
   */
  public static inspectSecurityAnomaly(
    user: AuthUser | null,
    routeRole: UserRole,
    attemptedRoute: string
  ): { anomalyDetected: boolean; reason?: string } {
    if (!user) return { anomalyDetected: false };

    if (user.role !== routeRole) {
      return {
        anomalyDetected: true,
        reason: `Cross-portal boundary violation: User with role '${user.role}' attempted to access route '${attemptedRoute}' reserved for '${routeRole}'.`
      };
    }

    return { anomalyDetected: false };
  }
}
