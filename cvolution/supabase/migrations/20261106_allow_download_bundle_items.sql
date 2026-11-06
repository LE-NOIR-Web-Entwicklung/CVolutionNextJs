-- One bundle order unlocks several documents, so an order can now have several items.
ALTER TABLE service_download_items
  DROP CONSTRAINT IF EXISTS service_download_items_order_id_key;

ALTER TABLE service_download_items
  ADD CONSTRAINT service_download_items_order_id_product_key_key UNIQUE (order_id, product_key);
