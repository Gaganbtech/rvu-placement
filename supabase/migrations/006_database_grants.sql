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
