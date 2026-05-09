alter table public.coupons
  add column if not exists max_redemptions integer,
  add column if not exists max_redemptions_per_user integer,
  add column if not exists min_order_amount numeric(10,2),
  add column if not exists campaign_tag text;
