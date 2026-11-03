CREATE OR REPLACE FUNCTION public.valid_application_motivation_form(form jsonb)
RETURNS boolean
LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT CASE WHEN jsonb_typeof(form) = 'object' THEN
    form ?& ARRAY['applicationType', 'jobTitle', 'company', 'companyStreet', 'companyPostalCode', 'companyCity', 'recipient', 'jobAd', 'jobAdUrl', 'language']
    AND form->>'applicationType' IN ('reactive', 'spontaneous')
    AND form->>'language' IN ('de-CH', 'de', 'en', 'fr')
    AND (SELECT bool_and(jsonb_typeof(value) = 'string' AND length(value #>> '{}') <= CASE key
      WHEN 'applicationType' THEN 11 WHEN 'language' THEN 5
      WHEN 'jobTitle' THEN 140 WHEN 'company' THEN 140
      WHEN 'companyStreet' THEN 160 WHEN 'companyPostalCode' THEN 16
      WHEN 'companyCity' THEN 80 WHEN 'recipient' THEN 180
      WHEN 'jobAd' THEN 9000 WHEN 'jobAdUrl' THEN 500 ELSE -1 END)
      FROM jsonb_each(form))
    AND (form->>'jobAdUrl' = '' OR form->>'jobAdUrl' ~* '^https?://[^/@[:space:]]+([/?#]|$)')
  ELSE false END;
$$;

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL CHECK (length(btrim(company)) BETWEEN 1 AND 140),
  job_title text NOT NULL CHECK (length(btrim(job_title)) BETWEEN 1 AND 140),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_at date,
  deadline date,
  next_action_at date,
  next_action text NOT NULL DEFAULT '' CHECK (length(next_action) <= 240),
  notes text NOT NULL DEFAULT '' CHECK (length(notes) <= 5000),
  motivation_form jsonb NOT NULL CHECK (public.valid_application_motivation_form(motivation_form)),
  motivation_letter text NOT NULL DEFAULT '' CHECK (length(motivation_letter) <= 12000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (motivation_form->>'company' = company AND motivation_form->>'jobTitle' = job_title)
);

CREATE INDEX applications_owner_created_idx ON public.applications (user_id, created_at DESC, id DESC);

CREATE OR REPLACE FUNCTION public.set_applications_updated_at()
RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  NEW.id = OLD.id;
  NEW.user_id = OLD.user_id;
  NEW.created_at = OLD.created_at;
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.set_applications_updated_at();

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.applications FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;

CREATE POLICY "Users read own applications" ON public.applications
FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users create own applications" ON public.applications
FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users update own applications" ON public.applications
FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users delete own applications" ON public.applications
FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
