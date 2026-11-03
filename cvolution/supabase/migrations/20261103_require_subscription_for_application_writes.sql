-- All application creation and updates go through the server API, which
-- verifies the current subscription before writing with the service role.
-- Direct Data API writes must not bypass that entitlement check.
REVOKE INSERT, UPDATE ON public.applications FROM authenticated, anon;

CREATE TABLE public.application_import_limits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE public.application_import_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.application_import_limits FROM PUBLIC, authenticated, anon;

CREATE FUNCTION public.claim_application_import(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE
  claimed uuid;
BEGIN
  INSERT INTO public.application_import_limits (user_id, requested_at)
  VALUES (p_user_id, clock_timestamp())
  ON CONFLICT (user_id) DO UPDATE
    SET requested_at = EXCLUDED.requested_at
    WHERE public.application_import_limits.requested_at <= clock_timestamp() - interval '10 seconds'
  RETURNING user_id INTO claimed;
  RETURN claimed IS NOT NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_application_import(uuid) FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.claim_application_import(uuid) TO service_role;
