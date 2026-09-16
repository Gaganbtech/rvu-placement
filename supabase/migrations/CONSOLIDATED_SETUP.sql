-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 001: PROFILES & APPLICATION ROLES
-- ==============================================================================

-- 1. Create profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('student', 'recruiter', 'placement')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  student_id TEXT,
  company_name TEXT,
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by auth_user_id (crucial for AuthProvider resolution)
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Trigger function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Automatic profile provisioning trigger upon auth.users creation
-- Security hardened: Only trusted server/Edge Function metadata (raw_app_meta_data)
-- can assign 'placement' or 'recruiter'. Self-signups default strictly to 'student'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  user_full_name TEXT;
  is_privileged_creator BOOLEAN;
BEGIN
  -- Check if user was provisioned via service_role or admin API with app_metadata
  is_privileged_creator := (NEW.raw_app_meta_data IS NOT NULL AND NEW.raw_app_meta_data ? 'role');
  
  IF is_privileged_creator THEN
    assigned_role := NEW.raw_app_meta_data->>'role';
  ELSE
    -- Client-supplied user metadata can never grant 'placement' or 'recruiter'
    assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    IF assigned_role IN ('placement', 'recruiter') THEN
      assigned_role := 'student'; -- Neutralize client role escalation
    END IF;
  END IF;

  IF assigned_role NOT IN ('student', 'recruiter', 'placement') THEN
    assigned_role := 'student';
  END IF;

  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (
    auth_user_id,
    email,
    full_name,
    role,
    is_active,
    student_id,
    company_name,
    department
  ) VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    assigned_role,
    true,
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'department'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 002: ROW LEVEL SECURITY FOR PROFILES
-- ==============================================================================

-- 1. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Revoke default anonymous access; grant controlled verbs to authenticated
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- Helper function: Check if current authenticated user is active Placement Cell member
CREATE OR REPLACE FUNCTION public.is_placement_cell()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid()
    AND role = 'placement'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Helper function: Get the current user's profile role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE auth_user_id = auth.uid()
  AND is_active = true;
  RETURN current_user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 2. Policy: Users can view their own profile
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- 3. Policy: Placement Cell can view all profiles for placement administration
DROP POLICY IF EXISTS "profiles_select_placement_cell" ON public.profiles;
CREATE POLICY "profiles_select_placement_cell"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_placement_cell());

-- 4. Policy: Users can update their own profile safe fields
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- 5. Policy: Placement Cell can update profiles (e.g. activate/deactivate accounts, verify profiles)
DROP POLICY IF EXISTS "profiles_update_placement_cell" ON public.profiles;
CREATE POLICY "profiles_update_placement_cell"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_placement_cell())
  WITH CHECK (public.is_placement_cell());

-- 6. Policy: Placement Cell can insert profiles directly for administrative provisioning
DROP POLICY IF EXISTS "profiles_insert_placement_cell" ON public.profiles;
CREATE POLICY "profiles_insert_placement_cell"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_placement_cell());

-- 7. Trigger: Hard prevent client-side privilege escalation on role, auth_user_id, or is_active
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Disallow regular authenticated users from altering role, auth_user_id, or is_active
  IF (NEW.role IS DISTINCT FROM OLD.role) THEN
    -- Only allow if called by superuser or trusted placement admin
    IF NOT public.is_placement_cell() THEN
      RAISE EXCEPTION 'Privilege escalation blocked: Changing user role is restricted to Placement Cell administration.';
    END IF;
  END IF;

  IF (NEW.auth_user_id IS DISTINCT FROM OLD.auth_user_id) THEN
    RAISE EXCEPTION 'Security violation: Re-binding auth_user_id is strictly forbidden.';
  END IF;

  IF (NEW.is_active IS DISTINCT FROM OLD.is_active) THEN
    IF NOT public.is_placement_cell() THEN
      RAISE EXCEPTION 'Access control violation: Changing account activation status requires Placement Cell authorization.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_fields();
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
-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 004: OBJECT-LEVEL ROW LEVEL SECURITY
-- ==============================================================================

-- Helper function: Get profile ID for current auth.uid()
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp;

-- Helper function: Get recruiter company ID for current auth.uid()
CREATE OR REPLACE FUNCTION public.current_recruiter_company_id()
RETURNS UUID AS $$
  SELECT r.company_id FROM public.recruiters r
  JOIN public.profiles p ON p.id = r.id
  WHERE p.auth_user_id = auth.uid() AND p.role = 'recruiter'
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp;

-- ==============================================================================
-- 1. STUDENTS TABLE RLS
-- ==============================================================================
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.students FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.students TO authenticated;

-- Students view their own record
CREATE POLICY "students_select_own"
  ON public.students FOR SELECT TO authenticated
  USING (id = public.current_profile_id());

-- Placement Cell full access to all students
CREATE POLICY "students_placement_all"
  ON public.students FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- Recruiters view students who have applied to their company's opportunities
CREATE POLICY "students_recruiter_applicant_select"
  ON public.students FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.opportunities o ON o.id = a.opportunity_id
      WHERE a.student_id = public.students.id
      AND (o.company_id = public.current_recruiter_company_id() OR o.created_by = public.current_profile_id())
    )
  );

-- Students can update their own profile (skills, projects)
CREATE POLICY "students_update_own"
  ON public.students FOR UPDATE TO authenticated
  USING (id = public.current_profile_id())
  WITH CHECK (id = public.current_profile_id());

-- Students or trigger can insert initial student row
CREATE POLICY "students_insert_own_or_placement"
  ON public.students FOR INSERT TO authenticated
  WITH CHECK (id = public.current_profile_id() OR public.is_placement_cell());

-- ==============================================================================
-- 2. RECRUITERS TABLE RLS
-- ==============================================================================
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.recruiters FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.recruiters TO authenticated;

CREATE POLICY "recruiters_select_own_company"
  ON public.recruiters FOR SELECT TO authenticated
  USING (
    id = public.current_profile_id() OR
    company_id = public.current_recruiter_company_id() OR
    public.is_placement_cell()
  );

CREATE POLICY "recruiters_placement_all"
  ON public.recruiters FOR ALL TO authenticated
  USING (public.is_placement_cell());

CREATE POLICY "recruiters_update_own"
  ON public.recruiters FOR UPDATE TO authenticated
  USING (id = public.current_profile_id())
  WITH CHECK (id = public.current_profile_id());

-- ==============================================================================
-- 3. COMPANIES RLS
-- ==============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.companies FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.companies TO authenticated;

CREATE POLICY "companies_select_verified"
  ON public.companies FOR SELECT TO authenticated
  USING (verification_status = 'verified' OR public.is_placement_cell() OR id = public.current_recruiter_company_id());

CREATE POLICY "companies_placement_all"
  ON public.companies FOR ALL TO authenticated
  USING (public.is_placement_cell());

CREATE POLICY "companies_recruiter_update_own"
  ON public.companies FOR UPDATE TO authenticated
  USING (id = public.current_recruiter_company_id())
  WITH CHECK (id = public.current_recruiter_company_id());

-- ==============================================================================
-- 4. OPPORTUNITIES RLS
-- ==============================================================================
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.opportunities FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;

-- Students view only published opportunities
CREATE POLICY "opportunities_select_published_student"
  ON public.opportunities FOR SELECT TO authenticated
  USING (
    status = 'published' OR 
    created_by = public.current_profile_id() OR
    company_id = public.current_recruiter_company_id() OR
    public.is_placement_cell()
  );

-- Recruiters can manage opportunities for their company
CREATE POLICY "opportunities_manage_recruiter"
  ON public.opportunities FOR ALL TO authenticated
  USING (
    created_by = public.current_profile_id() OR 
    company_id = public.current_recruiter_company_id()
  )
  WITH CHECK (
    created_by = public.current_profile_id() OR 
    company_id = public.current_recruiter_company_id()
  );

-- Placement Cell full management
CREATE POLICY "opportunities_placement_all"
  ON public.opportunities FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- ==============================================================================
-- 5. APPLICATIONS RLS
-- ==============================================================================
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.applications FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;

-- Students can view, submit, and withdraw only their own applications
CREATE POLICY "applications_student_select_own"
  ON public.applications FOR SELECT TO authenticated
  USING (student_id = public.current_profile_id());

CREATE POLICY "applications_student_insert_own"
  ON public.applications FOR INSERT TO authenticated
  WITH CHECK (student_id = public.current_profile_id());

CREATE POLICY "applications_student_update_own"
  ON public.applications FOR UPDATE TO authenticated
  USING (student_id = public.current_profile_id())
  WITH CHECK (student_id = public.current_profile_id() AND stage = 'withdrawn');

-- Recruiters view and update applications belonging to their company's opportunities
CREATE POLICY "applications_recruiter_manage"
  ON public.applications FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = applications.opportunity_id
      AND (o.company_id = public.current_recruiter_company_id() OR o.created_by = public.current_profile_id())
    )
  );

-- Placement Cell has operational oversight
CREATE POLICY "applications_placement_all"
  ON public.applications FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- ==============================================================================
-- 6. PLACEMENT DRIVES RLS
-- ==============================================================================
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.placement_drives FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_drives TO authenticated;

-- Authenticated students and recruiters view scheduled/active drives
CREATE POLICY "placement_drives_select"
  ON public.placement_drives FOR SELECT TO authenticated
  USING (
    status IN ('scheduled', 'ongoing', 'completed') OR
    company_id = public.current_recruiter_company_id() OR
    public.is_placement_cell()
  );

CREATE POLICY "placement_drives_recruiter_manage"
  ON public.placement_drives FOR ALL TO authenticated
  USING (company_id = public.current_recruiter_company_id())
  WITH CHECK (company_id = public.current_recruiter_company_id());

CREATE POLICY "placement_drives_placement_all"
  ON public.placement_drives FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- ==============================================================================
-- 7. INTERVIEW SCHEDULES RLS
-- ==============================================================================
ALTER TABLE public.interview_schedules ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.interview_schedules FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.interview_schedules TO authenticated;

-- Students view only their own scheduled interviews
CREATE POLICY "interviews_student_select_own"
  ON public.interview_schedules FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = interview_schedules.application_id
      AND a.student_id = public.current_profile_id()
    )
  );

-- Recruiters view and schedule interviews for their company applicants
CREATE POLICY "interviews_recruiter_manage"
  ON public.interview_schedules FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.opportunities o ON o.id = a.opportunity_id
      WHERE a.id = interview_schedules.application_id
      AND (o.company_id = public.current_recruiter_company_id() OR o.created_by = public.current_profile_id())
    )
  );

CREATE POLICY "interviews_placement_all"
  ON public.interview_schedules FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- ==============================================================================
-- 8. OFFERS RLS
-- ==============================================================================
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.offers FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.offers TO authenticated;

-- Students view their own offers and can update status (accept/decline)
CREATE POLICY "offers_student_select_own"
  ON public.offers FOR SELECT TO authenticated
  USING (student_id = public.current_profile_id());

CREATE POLICY "offers_student_update_response"
  ON public.offers FOR UPDATE TO authenticated
  USING (student_id = public.current_profile_id())
  WITH CHECK (
    student_id = public.current_profile_id() AND
    status IN ('accepted', 'declined')
  );

-- Recruiters manage offers issued by their company
CREATE POLICY "offers_recruiter_manage"
  ON public.offers FOR ALL TO authenticated
  USING (company_id = public.current_recruiter_company_id())
  WITH CHECK (company_id = public.current_recruiter_company_id());

CREATE POLICY "offers_placement_all"
  ON public.offers FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- ==============================================================================
-- 9. STUDENT DOCUMENTS RLS
-- ==============================================================================
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.student_documents FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_documents TO authenticated;

-- Students manage their own documents
CREATE POLICY "student_documents_student_manage_own"
  ON public.student_documents FOR ALL TO authenticated
  USING (student_id = public.current_profile_id())
  WITH CHECK (student_id = public.current_profile_id());

-- Recruiters can view documents (resumes) of candidates who applied to their company
CREATE POLICY "student_documents_recruiter_applicant_view"
  ON public.student_documents FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.opportunities o ON o.id = a.opportunity_id
      WHERE a.student_id = student_documents.student_id
      AND (o.company_id = public.current_recruiter_company_id() OR o.created_by = public.current_profile_id())
    )
  );

CREATE POLICY "student_documents_placement_all"
  ON public.student_documents FOR ALL TO authenticated
  USING (public.is_placement_cell());

-- ==============================================================================
-- 10. NOTIFICATIONS RLS
-- ==============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.notifications FROM anon;
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;

-- Users can only view, mark as read, or dismiss their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT TO authenticated
  USING (user_id = public.current_profile_id());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = public.current_profile_id())
  WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE TO authenticated
  USING (user_id = public.current_profile_id());

CREATE POLICY "notifications_placement_manage"
  ON public.notifications FOR ALL TO authenticated
  USING (public.is_placement_cell());
-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 005: AUDIT LOGS & SECURE PRIVATE STORAGE
-- ==============================================================================

-- 1. Institutional Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.audit_logs FROM anon;
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- Placement Cell can view full audit logs
CREATE POLICY "audit_logs_placement_select"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_placement_cell());

-- Authenticated users can insert their own activity audit records
CREATE POLICY "audit_logs_authenticated_insert"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_user_id = auth.uid());

-- Hard trigger: Prevent any UPDATE or DELETE operations on audit_logs
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Security Policy: Audit logs are immutable. UPDATE and DELETE are prohibited.';
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_mutation ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_log_mutation
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- ==============================================================================
-- 2. PRIVATE STORAGE BUCKET: student-documents
-- ==============================================================================

-- Create bucket as private (public = false)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-documents',
  'student-documents',
  false,
  10485760, -- 10MB maximum file size limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- Storage Policy: Students can upload only to their own folder (folder name = auth.uid())
DROP POLICY IF EXISTS "student_documents_upload_own" ON storage.objects;
CREATE POLICY "student_documents_upload_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'student-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Students can read their own uploaded documents
DROP POLICY IF EXISTS "student_documents_select_own" ON storage.objects;
CREATE POLICY "student_documents_select_own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Placement Cell can read all student documents
DROP POLICY IF EXISTS "student_documents_placement_select" ON storage.objects;
CREATE POLICY "student_documents_placement_select"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-documents' AND
    public.is_placement_cell()
  );

-- Storage Policy: Recruiters can view applicant resumes
DROP POLICY IF EXISTS "student_documents_recruiter_applicant_select" ON storage.objects;
CREATE POLICY "student_documents_recruiter_applicant_select"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-documents' AND
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.opportunities o ON o.id = a.opportunity_id
      JOIN public.profiles s ON s.id = a.student_id
      WHERE s.auth_user_id::text = (storage.foldername(name))[1]
      AND (o.company_id = public.current_recruiter_company_id() OR o.created_by = public.current_profile_id())
    )
  );

-- Storage Policy: Students can delete their own documents
DROP POLICY IF EXISTS "student_documents_delete_own" ON storage.objects;
CREATE POLICY "student_documents_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'student-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 006: DATABASE PRIVILEGES & LEAST PRIVILEGE GRANTS
-- ==============================================================================

-- 1. Revoke ALL permissions on public schema tables from anon
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Explicitly allow anon to execute only safe health/diagnostic functions if needed
GRANT USAGE ON SCHEMA public TO anon;

-- 2. Grant controlled permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;

-- Profiles: SELECT own or placement; UPDATE own safe fields
GRANT SELECT, UPDATE, INSERT ON public.profiles TO authenticated;

-- Domain entity tables
GRANT SELECT, INSERT, UPDATE ON public.students TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.recruiters TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_drives TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.interview_schedules TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.offers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_documents TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- Disallow authenticated role from dropping, altering, or truncating any table
-- (Default PostgreSQL settings already restrict this to table owners, but explicit checks ensure zero leak)

-- 3. Sequences usage for authenticated role
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 4. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO authenticated;
