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
