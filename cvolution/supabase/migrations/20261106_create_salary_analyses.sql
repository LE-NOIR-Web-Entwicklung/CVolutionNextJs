-- Latest AI salary analysis per user. Salary data stays behind the server API:
-- it checks the session and subscription and writes with the service role.
CREATE TABLE public.salary_analyses (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  result jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.salary_analyses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.salary_analyses FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.salary_analyses TO service_role;
