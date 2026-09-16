// src/services/data/placementDataService.ts
// Production Supabase Placement Cell Data Service for RVU Career Hub
// Comprehensive administration, institutional audit queries, and operational management.

import { supabase, SUPABASE_URL } from '../../lib/supabase';
import { sanitizeErrorMessage } from '../../lib/errorUtils';
import type { 
  ProfileRow, 
  StudentRow, 
  CompanyRow, 
  OpportunityRow, 
  ApplicationRow, 
  PlacementDriveRow, 
  OfferRow, 
  AuditLogRow 
} from '../../types/database';

export interface PlacementServiceResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface ProvisionUserInput {
  email: string;
  fullName: string;
  role: 'student' | 'recruiter' | 'placement';
  studentId?: string;
  school?: string;
  programme?: string;
  companyName?: string;
  department?: string;
  temporaryPassword?: string;
}

export class PlacementDataService {
  /**
   * Fetch all registered student cohorts with academic metrics
   */
  public async getStudents(filters?: { school?: string; search?: string }): Promise<PlacementServiceResult<Array<{ profile: ProfileRow; student: StudentRow | null }>>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (filters?.search && filters.search.trim()) {
        query = query.or(`full_name.ilike.%${filters.search.trim()}%,email.ilike.%${filters.search.trim()}%,student_id.ilike.%${filters.search.trim()}%`);
      }

      const { data: profiles, error: profError } = await query;
      if (profError) {
        return { success: false, data: null, error: sanitizeErrorMessage(profError, 'Unable to load student cohort.') };
      }

      if (!profiles || profiles.length === 0) {
        return { success: true, data: [] };
      }

      const profileIds = profiles.map(p => p.id);
      const { data: students } = await supabase
        .from('students')
        .select('*')
        .in('id', profileIds);

      const studentMap = new Map((students || []).map(s => [s.id, s]));

      const combined = profiles.map(p => ({
        profile: p as ProfileRow,
        student: (studentMap.get(p.id) || null) as StudentRow | null,
      }));

      return { success: true, data: combined };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch student cohort.') };
    }
  }

  /**
   * Fetch all partner companies
   */
  public async getCompanies(): Promise<PlacementServiceResult<CompanyRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load companies.') };
      }
      return { success: true, data: (data || []) as CompanyRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch companies.') };
    }
  }

  /**
   * Approve or reject a corporate partner organization
   */
  public async updateCompanyVerification(companyId: string, status: 'verified' | 'rejected'): Promise<PlacementServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('companies')
        .update({ verification_status: status })
        .eq('id', companyId);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to update company verification status.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to update company verification.') };
    }
  }

  /**
   * Fetch all opportunities across all companies
   */
  public async getOpportunities(statusFilter?: string): Promise<PlacementServiceResult<OpportunityRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      let query = supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
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
   * Approve pending opportunity for publication to students
   */
  public async approveOpportunity(opportunityId: string): Promise<PlacementServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: 'published' })
        .eq('id', opportunityId);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to approve opportunity.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to approve opportunity.') };
    }
  }

  /**
   * Fetch institutional applications master
   */
  public async getApplications(): Promise<PlacementServiceResult<ApplicationRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
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
   * Schedule a new campus placement drive
   */
  public async createDrive(data: {
    companyId: string;
    title: string;
    driveDate: string;
    venue?: string;
    roundsInfo?: string;
  }): Promise<PlacementServiceResult<PlacementDriveRow>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data: drive, error } = await supabase
        .from('placement_drives')
        .insert({
          company_id: data.companyId,
          title: data.title,
          drive_date: data.driveDate,
          venue: data.venue || null,
          rounds_info: data.roundsInfo || null,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to schedule drive.') };
      }
      return { success: true, data: drive as PlacementDriveRow };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to create drive.') };
    }
  }

  /**
   * Fetch all extended and verified job offers
   */
  public async getOffers(): Promise<PlacementServiceResult<OfferRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
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
   * Verify an offer letter officially for RVU CAR compliance
   */
  public async verifyOffer(offerId: string): Promise<PlacementServiceResult<void>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'verified' })
        .eq('id', offerId);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Failed to verify offer.') };
      }
      return { success: true, data: null };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to verify offer.') };
    }
  }

  /**
   * Fetch immutable security and operational audit logs
   */
  public async getAuditLogs(limit: number = 50): Promise<PlacementServiceResult<AuditLogRow[]>> {
    if (!supabase) return { success: false, data: null, error: 'Database client is not available.' };
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, data: null, error: sanitizeErrorMessage(error, 'Unable to load audit logs.') };
      }
      return { success: true, data: (data || []) as AuditLogRow[] };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Failed to fetch audit logs.') };
    }
  }

  /**
   * Provision user securely via admin-user-provisioning Edge Function
   */
  public async provisionUser(userData: ProvisionUserInput, jwtToken: string): Promise<PlacementServiceResult<string>> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-user-provisioning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!response.ok) {
        return { success: false, data: null, error: result.error || 'Failed to provision user.' };
      }
      return { success: true, data: result.message || 'User successfully provisioned.' };
    } catch (err) {
      return { success: false, data: null, error: sanitizeErrorMessage(err, 'Edge Function request failed.') };
    }
  }
}

export const placementDataService = new PlacementDataService();
