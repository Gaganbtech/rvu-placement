// src/services/data/recruiterDataService.ts
// Production Supabase Recruiter Data Service for RVU Career Hub
// Enforces company-level isolation, typed responses, and zero mock fallbacks.

import { supabase } from '../../lib/supabase';
import { sanitizeErrorMessage } from '../../lib/errorUtils';
import type { 
  ProfileRow, 
  RecruiterRow, 
  CompanyRow, 
  OpportunityRow, 
  ApplicationRow, 
  InterviewScheduleRow, 
  OfferRow 
} from '../../types/database';

export interface RecruiterServiceResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export class RecruiterDataService {
  /**
   * Fetch authenticated recruiter's profile, company association, and verification status
   */
  public async getRecruiterProfile(authUserId: string): Promise<RecruiterServiceResult<{ profile: ProfileRow; recruiter: RecruiterRow | null; company: CompanyRow | null }>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .eq('role', 'recruiter')
        .single();

      if (profError || !profile) {
        return { success: false, data: null, error: sanitizeErrorMessage(profError, 'Unable to load recruiter profile.') };
      }

      const { data: recruiter } = await supabase
        .from('recruiters')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();

      let company: CompanyRow | null = null;
      if (recruiter?.company_id) {
        const { data: comp } = await supabase
          .from('companies')
          .select('*')
          .eq('id', recruiter.company_id)
          .maybeSingle();
        company = comp as CompanyRow | null;
      }

      return {
        success: true,
        data: {
          profile: profile as ProfileRow,
          recruiter: recruiter as RecruiterRow | null,
          company,
        }
      };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch recruiter profile.') };
    }
  }

  /**
   * Fetch company details
   */
  public async getCompany(companyId: string): Promise<RecruiterServiceResult<CompanyRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load company profile.') };
      }
      return { success: true, data: data as CompanyRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch company.') };
    }
  }

  /**
   * Fetch opportunities posted by this company
   */
  public async getOpportunities(companyId: string): Promise<RecruiterServiceResult<OpportunityRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load opportunities.') };
      }
      return { success: true, data: (data || []) as OpportunityRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch opportunities.') };
    }
  }

  /**
   * Post a new job or internship opportunity for this company
   */
  public async createOpportunity(
    companyId: string, 
    recruiterProfileId: string, 
    data: {
      title: string;
      roleType: 'full-time' | 'internship' | 'both';
      ctcRange?: string;
      location?: string;
      workMode: 'on-site' | 'hybrid' | 'remote';
      deadline?: string;
      description?: string;
      requirements?: string[];
      eligibleSchools?: string[];
      eligibleProgrammes?: string[];
      minCgpa?: number;
    }
  ): Promise<RecruiterServiceResult<OpportunityRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data: opp, error } = await supabase
        .from('opportunities')
        .insert({
          company_id: companyId,
          created_by: recruiterProfileId,
          title: data.title,
          role_type: data.roleType,
          ctc_range: data.ctcRange || null,
          location: data.location || null,
          work_mode: data.workMode,
          deadline: data.deadline || null,
          description: data.description || null,
          requirements: data.requirements || [],
          eligible_schools: data.eligibleSchools || [],
          eligible_programmes: data.eligibleProgrammes || [],
          min_cgpa: data.minCgpa || null,
          status: 'pending_approval', // Requires CAR placement office approval
        })
        .select()
        .single();

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to create opportunity.') };
      }
      return { success: true, data: opp as OpportunityRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to create opportunity.') };
    }
  }

  /**
   * Fetch applications submitted to this company's opportunities
   */
  public async getApplications(companyId: string): Promise<RecruiterServiceResult<ApplicationRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      // First get company's opportunity IDs
      const { data: opps, error: oppError } = await supabase
        .from('opportunities')
        .select('id')
        .eq('company_id', companyId);

      if (oppError || !opps || opps.length === 0) {
        return { success: true, data: [] };
      }

      const oppIds = opps.map(o => o.id);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('opportunity_id', oppIds)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load applications.') };
      }
      return { success: true, data: (data || []) as ApplicationRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch applications.') };
    }
  }

  /**
   * Advance candidate stage in recruitment pipeline
   */
  public async updateApplicationStage(
    applicationId: string, 
    stage: 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'offered' | 'rejected',
    feedback?: string
  ): Promise<RecruiterServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          stage,
          feedback: feedback || null,
        })
        .eq('id', applicationId);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to update application stage.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to update candidate stage.') };
    }
  }

  /**
   * Schedule an interview round for an applicant
   */
  public async scheduleInterview(
    applicationId: string, 
    roundNumber: number, 
    roundTitle: string, 
    scheduledAt: string, 
    meetingLink?: string, 
    interviewerName?: string
  ): Promise<RecruiterServiceResult<InterviewScheduleRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('interview_schedules')
        .insert({
          application_id: applicationId,
          round_number: roundNumber,
          round_title: roundTitle,
          scheduled_at: scheduledAt,
          meeting_link: meetingLink || null,
          interviewer_name: interviewerName || null,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to schedule interview.') };
      }
      return { success: true, data: data as InterviewScheduleRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to schedule interview.') };
    }
  }

  /**
   * Issue a job offer to a selected candidate
   */
  public async createOffer(
    applicationId: string, 
    studentProfileId: string, 
    companyId: string, 
    designation: string, 
    ctcAnnual: number, 
    baseSalary?: number, 
    validUntil?: string
  ): Promise<RecruiterServiceResult<OfferRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          application_id: applicationId,
          student_id: studentProfileId,
          company_id: companyId,
          designation,
          ctc_annual: ctcAnnual,
          base_salary: baseSalary || null,
          valid_until: validUntil || null,
          status: 'extended',
        })
        .select()
        .single();

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to issue offer.') };
      }

      // Also update application status to offered
      await supabase
        .from('applications')
        .update({ stage: 'offered' })
        .eq('id', applicationId);

      return { success: true, data: data as OfferRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to issue offer.') };
    }
  }
}

export const recruiterDataService = new RecruiterDataService();
