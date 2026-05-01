ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS is_external BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS external_source TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_is_external ON orders(is_external);
