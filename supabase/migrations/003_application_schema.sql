-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 003: APPLICATION ENTITY SCHEMA
-- ==============================================================================

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_verification ON public.companies(verification_status);

CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Students Domain Entity Table (Extends profiles for student role)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  usn TEXT UNIQUE,
  school TEXT NOT NULL,
  programme TEXT NOT NULL,
  batch TEXT NOT NULL DEFAULT '2022 - 2026',
  graduation_year INTEGER NOT NULL DEFAULT 2026,
  cgpa NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  active_backlogs INTEGER NOT NULL DEFAULT 0,
  attendance_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  placement_status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (placement_status IN ('NOT_STARTED', 'ELIGIBLE', 'PARTICIPATING', 'SELECTED', 'PLACED', 'OPTED_OUT')),
  eligibility_status TEXT NOT NULL DEFAULT 'ELIGIBLE' CHECK (eligibility_status IN ('ELIGIBLE', 'NOT_ELIGIBLE', 'UNDER_REVIEW')),
  readiness_score INTEGER NOT NULL DEFAULT 0,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_students_school ON public.students(school);
CREATE INDEX IF NOT EXISTS idx_students_programme ON public.students(programme);
CREATE INDEX IF NOT EXISTS idx_students_usn ON public.students(usn);
CREATE INDEX IF NOT EXISTS idx_students_placement_status ON public.students(placement_status);

CREATE TRIGGER set_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Recruiters Domain Entity Table (Extends profiles for recruiter role)
CREATE TABLE IF NOT EXISTS public.recruiters (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  designation TEXT,
  department TEXT,
  is_primary_contact BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_recruiters_company_id ON public.recruiters(company_id);
CREATE INDEX IF NOT EXISTS idx_recruiters_verification ON public.recruiters(verification_status);

CREATE TRIGGER set_recruiters_updated_at
  BEFORE UPDATE ON public.recruiters
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  role_type TEXT NOT NULL DEFAULT 'full-time' CHECK (role_type IN ('full-time', 'internship', 'both')),
  ctc_range TEXT,
  location TEXT,
  work_mode TEXT NOT NULL DEFAULT 'on-site' CHECK (work_mode IN ('on-site', 'hybrid', 'remote')),
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'closed', 'archived')),
  description TEXT,
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligible_schools TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligible_programmes TEXT[] DEFAULT ARRAY[]::TEXT[],
  min_cgpa NUMERIC(4,2),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON public.opportunities(created_by);

CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'applied' CHECK (stage IN ('applied', 'screening', 'shortlisted', 'assessment', 'interview', 'offered', 'rejected', 'withdrawn')),
  resume_url TEXT,
  cover_letter TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_student_opportunity_application UNIQUE (opportunity_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_stage ON public.applications(stage);

CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Placement Drives Table
CREATE TABLE IF NOT EXISTS public.placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  drive_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  rounds_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_drives_company_id ON public.placement_drives(company_id);
CREATE INDEX IF NOT EXISTS idx_drives_status ON public.placement_drives(status);

CREATE TRIGGER set_placement_drives_updated_at
  BEFORE UPDATE ON public.placement_drives
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Interview Schedules Table
CREATE TABLE IF NOT EXISTS public.interview_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL DEFAULT 1,
  round_title TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  meeting_link TEXT,
  interviewer_name TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'rescheduled', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON public.interview_schedules(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interview_schedules(status);

CREATE TRIGGER set_interview_schedules_updated_at
  BEFORE UPDATE ON public.interview_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8. Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ctc_annual NUMERIC(12,2),
  base_salary NUMERIC(12,2),
  designation TEXT NOT NULL,
  offer_letter_url TEXT,
  valid_until TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'extended' CHECK (status IN ('extended', 'accepted', 'declined', 'verified', 'rescinded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_offers_student_id ON public.offers(student_id);
CREATE INDEX IF NOT EXISTS idx_offers_company_id ON public.offers(company_id);
CREATE INDEX IF NOT EXISTS idx_offers_application_id ON public.offers(application_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);

CREATE TRIGGER set_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 9. Student Documents Table
CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'resume' CHECK (document_type IN ('resume', 'transcript', 'certificate', 'id_proof', 'other')),
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_documents_student_id ON public.student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.student_documents(document_type);

CREATE TRIGGER set_student_documents_updated_at
  BEFORE UPDATE ON public.student_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
