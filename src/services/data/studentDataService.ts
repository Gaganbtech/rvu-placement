// src/services/data/studentDataService.ts
// Production Supabase Student Data Service for RVU Career Hub
// Enforces real Supabase Data API calls, typed responses, and zero mock fallbacks.

import { supabase } from '../../lib/supabase';
import { sanitizeErrorMessage } from '../../lib/errorUtils';
import type { 
  ProfileRow, 
  StudentRow, 
  OpportunityRow, 
  ApplicationRow, 
  PlacementDriveRow, 
  InterviewScheduleRow, 
  OfferRow, 
  StudentDocumentRow, 
  NotificationRow 
} from '../../types/database';

export interface StudentServiceResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export class StudentDataService {
  /**
   * Fetch authenticated student's profile and academic record
   */
  public async getStudentProfile(authUserId: string): Promise<StudentServiceResult<{ profile: ProfileRow; student: StudentRow | null }>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .eq('role', 'student')
        .single();

      if (profError || !profile) {
        return { success: false, data: null, error: sanitizeErrorMessage(profError, 'Unable to load student profile.') };
      }

      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();

      return {
        success: true,
        data: {
          profile: profile as ProfileRow,
          student: student as StudentRow | null,
        }
      };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch student profile.') };
    }
  }

  /**
   * Fetch published job and internship opportunities (RLS enforced)
   */
  public async getOpportunities(filters?: { search?: string; type?: string }): Promise<StudentServiceResult<OpportunityRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('role_type', filters.type as any);
      }
      if (filters?.search && filters.search.trim()) {
        query = query.ilike('title', `%${filters.search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load opportunities.') };
      }
      return { success: true, data: (data || []) as OpportunityRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch opportunities.') };
    }
  }

  /**
   * Fetch student's submitted applications
   */
  public async getApplications(studentProfileId: string): Promise<StudentServiceResult<ApplicationRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', studentProfileId)
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
   * Submit an application to a published opportunity
   */
  public async applyToOpportunity(
    studentProfileId: string, 
    opportunityId: string, 
    resumeUrl?: string, 
    coverLetter?: string
  ): Promise<StudentServiceResult<ApplicationRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          student_id: studentProfileId,
          stage: 'applied',
          resume_url: resumeUrl || null,
          cover_letter: coverLetter || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, data: null, error: 'You have already applied to this opportunity.' };
        }
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to submit application.') };
      }
      return { success: true, data: data as ApplicationRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to apply to opportunity.') };
    }
  }

  /**
   * Withdraw an active application
   */
  public async withdrawApplication(applicationId: string, studentProfileId: string): Promise<StudentServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('applications')
        .update({ stage: 'withdrawn' })
        .eq('id', applicationId)
        .eq('student_id', studentProfileId);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to withdraw application.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to withdraw application.') };
    }
  }

  /**
   * Fetch scheduled placement drives
   */
  public async getDrives(): Promise<StudentServiceResult<PlacementDriveRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('placement_drives')
        .select('*')
        .in('status', ['scheduled', 'ongoing'])
        .order('drive_date', { ascending: true });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load placement drives.') };
      }
      return { success: true, data: (data || []) as PlacementDriveRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch drives.') };
    }
  }

  /**
   * Fetch student's scheduled interviews
   */
  public async getInterviews(studentProfileId: string): Promise<StudentServiceResult<InterviewScheduleRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      // First get student's application IDs
      const { data: apps, error: appError } = await supabase
        .from('applications')
        .select('id')
        .eq('student_id', studentProfileId);

      if (appError || !apps || apps.length === 0) {
        return { success: true, data: [] };
      }

      const appIds = apps.map(a => a.id);
      const { data, error } = await supabase
        .from('interview_schedules')
        .select('*')
        .in('application_id', appIds)
        .order('scheduled_at', { ascending: true });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load interviews.') };
      }
      return { success: true, data: (data || []) as InterviewScheduleRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch interviews.') };
    }
  }

  /**
   * Fetch verified offers extended to student
   */
  public async getOffers(studentProfileId: string): Promise<StudentServiceResult<OfferRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('student_id', studentProfileId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load offers.') };
      }
      return { success: true, data: (data || []) as OfferRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch offers.') };
    }
  }

  /**
   * Accept or decline an extended offer
   */
  public async respondToOffer(
    offerId: string, 
    studentProfileId: string, 
    response: 'accepted' | 'declined'
  ): Promise<StudentServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: response })
        .eq('id', offerId)
        .eq('student_id', studentProfileId)
        .eq('status', 'extended');

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to record offer response.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to respond to offer.') };
    }
  }

  /**
   * Fetch student's uploaded documents (resumes, transcripts)
   */
  public async getDocuments(studentProfileId: string): Promise<StudentServiceResult<StudentDocumentRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_id', studentProfileId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load documents.') };
      }
      return { success: true, data: (data || []) as StudentDocumentRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch documents.') };
    }
  }

  /**
   * Upload a document to private student-documents storage and register in table
   */
  public async uploadDocument(
    authUserId: string,
    studentProfileId: string,
    file: File,
    title: string,
    documentType: 'resume' | 'transcript' | 'certificate' | 'id_proof' | 'other'
  ): Promise<StudentServiceResult<StudentDocumentRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, data: null, error: 'File size exceeds maximum 10MB limit.' };
      }

      // Upload to private bucket under folder: {authUserId}/{timestamp}-{filename}
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${authUserId}/${Date.now()}_${sanitizedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { success: false, data: null, error: sanitizeErrorMessage(uploadError, 'Storage upload failed.') };
      }

      // Record in student_documents table
      const { data, error: dbError } = await supabase
        .from('student_documents')
        .insert({
          student_id: studentProfileId,
          title,
          document_type: documentType,
          file_url: storagePath,
          file_size_bytes: file.size,
          is_verified: false,
        })
        .select()
        .single();

      if (dbError) {
        return { success: false, data: null, error: sanitizeErrorMessage(dbError, 'Failed to record document details.') };
      }
      return { success: true, data: data as StudentDocumentRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to upload document.') };
    }
  }

  /**
   * Fetch student's notifications
   */
  public async getNotifications(profileId: string): Promise<StudentServiceResult<NotificationRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profileId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load notifications.') };
      }
      return { success: true, data: (data || []) as NotificationRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch notifications.') };
    }
  }

  /**
   * Mark notification as read
   */
  public async markNotificationRead(notificationId: string, profileId: string): Promise<StudentServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', profileId);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to update notification.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to update notification.') };
    }
  }
}

export const studentDataService = new StudentDataService();
