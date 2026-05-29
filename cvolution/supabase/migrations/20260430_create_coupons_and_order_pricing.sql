CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC,
  applicable_services TEXT[] NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  redemption_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coupons_code_not_blank CHECK (btrim(code) <> ''),
  CONSTRAINT coupons_code_uppercase CHECK (code = upper(btrim(code))),
  CONSTRAINT coupons_code_unique UNIQUE (code),
  CONSTRAINT coupons_discount_type_check CHECK (discount_type IN ('percent', 'free')),
  CONSTRAINT coupons_percent_value_check CHECK (
    (discount_type = 'percent' AND discount_value BETWEEN 1 AND 100)
    OR (discount_type = 'free' AND (discount_value IS NULL OR discount_value = 100))
  ),
  CONSTRAINT coupons_time_check CHECK (ends_at > starts_at),
  CONSTRAINT coupons_redemption_count_check CHECK (redemption_count >= 0),
  CONSTRAINT coupons_services_check CHECK (
    array_length(applicable_services, 1) > 0
    AND applicable_services <@ ARRAY[
      'service-career',
      'service-check',
      'service-cv',
      'service-linkedin',
      'service-motivation',
      'service-rav',
      'service-salary'
    ]::TEXT[]
  )
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons (code);
CREATE INDEX IF NOT EXISTS idx_coupons_active_window ON coupons (is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_coupons_services ON coupons USING GIN (applicable_services);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_coupons_updated_at ON coupons;
CREATE TRIGGER set_coupons_updated_at
BEFORE UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION redeem_coupon(coupon_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  locked_coupon coupons%ROWTYPE;
BEGIN
  SELECT *
  INTO locked_coupon
  FROM coupons
  WHERE id = coupon_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE coupons
  SET redemption_count = redemption_count + 1,
      updated_at = now()
  WHERE id = coupon_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION redeem_coupon(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION redeem_coupon(uuid) FROM anon;
REVOKE ALL ON FUNCTION redeem_coupon(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION redeem_coupon(uuid) TO service_role;

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct public coupon access" ON coupons;
CREATE POLICY "No direct public coupon access" ON coupons
  FOR SELECT TO anon USING (false);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id),
  ADD COLUMN IF NOT EXISTS coupon_discount_type TEXT,
  ADD COLUMN IF NOT EXISTS coupon_discount_value NUMERIC,
  ADD COLUMN IF NOT EXISTS original_price NUMERIC,
  ADD COLUMN IF NOT EXISTS final_price NUMERIC,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_url TEXT;

ALTER TABLE orders
  ADD CONSTRAINT orders_coupon_discount_type_check
  CHECK (coupon_discount_type IS NULL OR coupon_discount_type IN ('percent', 'free')) NOT VALID;

ALTER TABLE orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'free_coupon', 'failed')) NOT VALID;

CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON orders(coupon_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
