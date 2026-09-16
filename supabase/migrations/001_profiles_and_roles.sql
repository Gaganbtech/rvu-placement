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
