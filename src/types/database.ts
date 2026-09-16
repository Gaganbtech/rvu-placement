/**
 * Database TypeScript Schema Definitions for RVU Career Hub
 * Strictly mapped to Supabase PostgreSQL Tables
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppUserRole = 'student' | 'recruiter' | 'placement';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          role: AppUserRole;
          is_active: boolean;
          student_id: string | null;
          company_name: string | null;
          department: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          role: AppUserRole;
          is_active?: boolean;
          student_id?: string | null;
          company_name?: string | null;
          department?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          email?: string;
          full_name?: string;
          role?: AppUserRole;
          is_active?: boolean;
          student_id?: string | null;
          company_name?: string | null;
          department?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      students: {
        Row: {
          id: string;
          usn: string | null;
          school: string;
          programme: string;
          batch: string;
          graduation_year: number;
          cgpa: number;
          active_backlogs: number;
          attendance_percentage: number;
          placement_status: 'NOT_STARTED' | 'ELIGIBLE' | 'PARTICIPATING' | 'SELECTED' | 'PLACED' | 'OPTED_OUT';
          eligibility_status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNDER_REVIEW';
          readiness_score: number;
          skills: Json;
          projects: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          usn?: string | null;
          school: string;
          programme: string;
          batch?: string;
          graduation_year?: number;
          cgpa?: number;
          active_backlogs?: number;
          attendance_percentage?: number;
          placement_status?: 'NOT_STARTED' | 'ELIGIBLE' | 'PARTICIPATING' | 'SELECTED' | 'PLACED' | 'OPTED_OUT';
          eligibility_status?: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNDER_REVIEW';
          readiness_score?: number;
          skills?: Json;
          projects?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          usn?: string | null;
          school?: string;
          programme?: string;
          batch?: string;
          graduation_year?: number;
          cgpa?: number;
          active_backlogs?: number;
          attendance_percentage?: number;
          placement_status?: 'NOT_STARTED' | 'ELIGIBLE' | 'PARTICIPATING' | 'SELECTED' | 'PLACED' | 'OPTED_OUT';
          eligibility_status?: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNDER_REVIEW';
          readiness_score?: number;
          skills?: Json;
          projects?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      recruiters: {
        Row: {
          id: string;
          company_id: string;
          designation: string | null;
          department: string | null;
          is_primary_contact: boolean;
          verification_status: 'verified' | 'pending' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id: string;
          designation?: string | null;
          department?: string | null;
          is_primary_contact?: boolean;
          verification_status?: 'verified' | 'pending' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          designation?: string | null;
          department?: string | null;
          is_primary_contact?: boolean;
          verification_status?: 'verified' | 'pending' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      companies: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          industry: string | null;
          website: string | null;
          logo_url: string | null;
          description: string | null;
          verification_status: 'verified' | 'pending' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          industry?: string | null;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          verification_status?: 'verified' | 'pending' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string | null;
          industry?: string | null;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          verification_status?: 'verified' | 'pending' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      opportunities: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          role_type: 'full-time' | 'internship' | 'both';
          ctc_range: string | null;
          location: string | null;
          work_mode: 'on-site' | 'hybrid' | 'remote';
          deadline: string | null;
          status: 'draft' | 'pending_approval' | 'published' | 'closed' | 'archived';
          description: string | null;
          requirements: string[] | null;
          eligible_schools: string[] | null;
          eligible_programmes: string[] | null;
          min_cgpa: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          role_type?: 'full-time' | 'internship' | 'both';
          ctc_range?: string | null;
          location?: string | null;
          work_mode?: 'on-site' | 'hybrid' | 'remote';
          deadline?: string | null;
          status?: 'draft' | 'pending_approval' | 'published' | 'closed' | 'archived';
          description?: string | null;
          requirements?: string[] | null;
          eligible_schools?: string[] | null;
          eligible_programmes?: string[] | null;
          min_cgpa?: number | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          role_type?: 'full-time' | 'internship' | 'both';
          ctc_range?: string | null;
          location?: string | null;
          work_mode?: 'on-site' | 'hybrid' | 'remote';
          deadline?: string | null;
          status?: 'draft' | 'pending_approval' | 'published' | 'closed' | 'archived';
          description?: string | null;
          requirements?: string[] | null;
          eligible_schools?: string[] | null;
          eligible_programmes?: string[] | null;
          min_cgpa?: number | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      applications: {
        Row: {
          id: string;
          opportunity_id: string;
          student_id: string;
          stage: 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
          resume_url: string | null;
          cover_letter: string | null;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          student_id: string;
          stage?: 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
          resume_url?: string | null;
          cover_letter?: string | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          student_id?: string;
          stage?: 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
          resume_url?: string | null;
          cover_letter?: string | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      placement_drives: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          drive_date: string;
          venue: string | null;
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          rounds_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          drive_date: string;
          venue?: string | null;
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          rounds_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          drive_date?: string;
          venue?: string | null;
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          rounds_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      interview_schedules: {
        Row: {
          id: string;
          application_id: string;
          round_number: number;
          round_title: string;
          scheduled_at: string;
          meeting_link: string | null;
          interviewer_name: string | null;
          status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          round_number: number;
          round_title: string;
          scheduled_at: string;
          meeting_link?: string | null;
          interviewer_name?: string | null;
          status?: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          round_number?: number;
          round_title?: string;
          scheduled_at?: string;
          meeting_link?: string | null;
          interviewer_name?: string | null;
          status?: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      offers: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          company_id: string;
          ctc_annual: number | null;
          base_salary: number | null;
          designation: string;
          offer_letter_url: string | null;
          valid_until: string | null;
          status: 'extended' | 'accepted' | 'declined' | 'verified' | 'rescinded';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          company_id: string;
          ctc_annual?: number | null;
          base_salary?: number | null;
          designation: string;
          offer_letter_url?: string | null;
          valid_until?: string | null;
          status?: 'extended' | 'accepted' | 'declined' | 'verified' | 'rescinded';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          company_id?: string;
          ctc_annual?: number | null;
          base_salary?: number | null;
          designation?: string;
          offer_letter_url?: string | null;
          valid_until?: string | null;
          status?: 'extended' | 'accepted' | 'declined' | 'verified' | 'rescinded';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      student_documents: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          document_type: 'resume' | 'transcript' | 'certificate' | 'id_proof' | 'other';
          file_url: string;
          file_size_bytes: number | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          document_type?: 'resume' | 'transcript' | 'certificate' | 'id_proof' | 'other';
          file_url: string;
          file_size_bytes?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          document_type?: 'resume' | 'transcript' | 'certificate' | 'id_proof' | 'other';
          file_url?: string;
          file_size_bytes?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'alert';
          read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'alert';
          read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'alert';
          read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          actor_role: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          actor_role?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          actor_role?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };

      access_requests: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          full_name: string;
          company_name: string | null;
          designation: string | null;
          phone: string | null;
          requested_type: 'recruiter' | 'student' | 'other';
          status: 'pending' | 'approved' | 'rejected';
          notes: string | null;
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          email: string;
          full_name: string;
          company_name?: string | null;
          designation?: string | null;
          phone?: string | null;
          requested_type: 'recruiter' | 'student' | 'other';
          status?: 'pending' | 'approved' | 'rejected';
          notes?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          email?: string;
          full_name?: string;
          company_name?: string | null;
          designation?: string | null;
          phone?: string | null;
          requested_type?: 'recruiter' | 'student' | 'other';
          status?: 'pending' | 'approved' | 'rejected';
          notes?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type StudentRow = Database['public']['Tables']['students']['Row'];
export type RecruiterRow = Database['public']['Tables']['recruiters']['Row'];
export type OpportunityRow = Database['public']['Tables']['opportunities']['Row'];
export type ApplicationRow = Database['public']['Tables']['applications']['Row'];
export type CompanyRow = Database['public']['Tables']['companies']['Row'];
export type PlacementDriveRow = Database['public']['Tables']['placement_drives']['Row'];
export type InterviewScheduleRow = Database['public']['Tables']['interview_schedules']['Row'];
export type OfferRow = Database['public']['Tables']['offers']['Row'];
export type StudentDocumentRow = Database['public']['Tables']['student_documents']['Row'];
export type NotificationRow = Database['public']['Tables']['notifications']['Row'];
export type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];
export type AccessRequestRow = Database['public']['Tables']['access_requests']['Row'];
