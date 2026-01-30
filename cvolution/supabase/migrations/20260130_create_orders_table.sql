CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processed', 'failed');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  birth_date TEXT,
  work_location TEXT,
  gross_annual_salary TEXT,
  fringe_benefits TEXT,
  linkedin_url TEXT,
  remarks TEXT,
  service_type TEXT NOT NULL,
  service_label TEXT NOT NULL,
  cv_file_base64 TEXT,
  cv_file_name TEXT,
  salary_file_base64 TEXT,
  salary_file_name TEXT,
  coupon_code TEXT,
  coupon_valid BOOLEAN DEFAULT FALSE,
  status order_status NOT NULL DEFAULT 'pending',
  payment_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_payment_token ON orders(payment_token);
CREATE INDEX idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON orders
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow read by id" ON orders
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow update status" ON orders
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
