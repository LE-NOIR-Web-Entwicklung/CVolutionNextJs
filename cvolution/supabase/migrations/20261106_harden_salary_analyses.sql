-- public.salary_analyses already exists from an earlier experiment and now stores
-- the dashboard analyses. Access stays behind the server API, and a deleted
-- account takes its salary data with it.
REVOKE ALL ON public.salary_analyses FROM PUBLIC, anon, authenticated;
ALTER TABLE public.salary_analyses
  ADD CONSTRAINT salary_analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX salary_analyses_owner_created_idx ON public.salary_analyses (user_id, created_at DESC);
