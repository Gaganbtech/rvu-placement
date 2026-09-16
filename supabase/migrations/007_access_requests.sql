-- ==============================================================================
-- RVU CAREER HUB — MIGRATION 007: ACCESS REQUESTS & CONTROLLED RECRUITER ONBOARDING
-- ==============================================================================

-- 1. Create access_requests table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  designation TEXT,
  phone TEXT,
  requested_type TEXT NOT NULL CHECK (requested_type IN ('recruiter', 'student', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for lookup and administration
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON public.access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON public.access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_type ON public.access_requests(requested_type);

-- 2. Enable Row-Level Security
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Revoke all default anonymous access
REVOKE ALL ON public.access_requests FROM anon;
GRANT INSERT ON public.access_requests TO anon;
GRANT SELECT, INSERT ON public.access_requests TO authenticated;

-- 3. Policy: Anyone can submit an access request in pending status only
DROP POLICY IF EXISTS "access_requests_insert_public" ON public.access_requests;
CREATE POLICY "access_requests_insert_public"
  ON public.access_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- 4. Policy: Users can view their own access requests
DROP POLICY IF EXISTS "access_requests_select_own" ON public.access_requests;
CREATE POLICY "access_requests_select_own"
  ON public.access_requests
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 5. Policy: Placement Cell can view all access requests
DROP POLICY IF EXISTS "access_requests_select_placement" ON public.access_requests;
CREATE POLICY "access_requests_select_placement"
  ON public.access_requests
  FOR SELECT
  TO authenticated
  USING (public.is_placement_cell());

-- 6. Policy: Placement Cell can review and update access requests
DROP POLICY IF EXISTS "access_requests_update_placement" ON public.access_requests;
CREATE POLICY "access_requests_update_placement"
  ON public.access_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_placement_cell())
  WITH CHECK (public.is_placement_cell());

-- 7. Trigger to prevent tampering with review fields by non-placement actors
CREATE OR REPLACE FUNCTION public.protect_access_request_status()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status IS DISTINCT FROM OLD.status OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at) THEN
    IF NOT public.is_placement_cell() THEN
      RAISE EXCEPTION 'Unauthorized: Reviewing access requests is restricted to Placement Cell administration.';
    END IF;
    NEW.reviewed_at := timezone('utc'::text, now());
    NEW.reviewed_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_protect_access_request_status ON public.access_requests;
CREATE TRIGGER trg_protect_access_request_status
  BEFORE UPDATE ON public.access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_access_request_status();
