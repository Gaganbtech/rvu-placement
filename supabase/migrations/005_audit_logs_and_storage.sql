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
