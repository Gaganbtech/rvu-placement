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
