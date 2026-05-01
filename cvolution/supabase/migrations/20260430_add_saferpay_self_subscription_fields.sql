ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS saferpay_token TEXT,
  ADD COLUMN IF NOT EXISTS saferpay_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS saferpay_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS saferpay_payment_status TEXT,
  ADD COLUMN IF NOT EXISTS saferpay_merchant_reference TEXT,
  ADD COLUMN IF NOT EXISTS saferpay_billing_period_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS saferpay_billing_period_end TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_orders_saferpay_token ON orders(saferpay_token);
CREATE INDEX IF NOT EXISTS idx_orders_saferpay_transaction_id ON orders(saferpay_transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_saferpay_merchant_reference ON orders(saferpay_merchant_reference);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_self_saferpay_billing_period
  ON orders(name, service_type, saferpay_billing_period_start)
  WHERE service_type = 'self' AND saferpay_billing_period_start IS NOT NULL;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_provider TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS saferpay_initial_transaction_id TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_saferpay_due_subscriptions
  ON profiles(subscription_current_period_end)
  WHERE subscription_provider = 'saferpay'
    AND subscription_status = 'active'
    AND saferpay_initial_transaction_id IS NOT NULL;
