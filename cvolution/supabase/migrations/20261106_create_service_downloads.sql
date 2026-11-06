-- Purchased documents: one protected link per checkout, one item per document.
-- Only the API (service role) reads these tables; there are deliberately no policies.
CREATE TABLE IF NOT EXISTS service_download_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  buyer_name TEXT,
  order_reference TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  code_hash TEXT,
  code_expires_at TIMESTAMPTZ,
  code_sent_at TIMESTAMPTZ,
  code_attempts INTEGER NOT NULL DEFAULT 0,
  session_hash TEXT,
  session_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_download_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID NOT NULL REFERENCES service_download_grants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  product_key TEXT NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  last_downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_download_items_grant_id_idx ON service_download_items(grant_id);

ALTER TABLE service_download_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_download_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE coupons
  DROP CONSTRAINT IF EXISTS coupons_services_check;

ALTER TABLE coupons
  ADD CONSTRAINT coupons_services_check CHECK (
    array_length(applicable_services, 1) > 0
    AND applicable_services <@ ARRAY[
      'service-career',
      'service-check',
      'service-cv',
      'service-downloads',
      'service-linkedin',
      'service-motivation',
      'service-rav',
      'service-salary'
    ]::TEXT[]
  ) NOT VALID;

-- All existing coupons also apply to the downloads.
UPDATE coupons
SET applicable_services = array_append(applicable_services, 'service-downloads')
WHERE NOT 'service-downloads' = ANY(applicable_services);
