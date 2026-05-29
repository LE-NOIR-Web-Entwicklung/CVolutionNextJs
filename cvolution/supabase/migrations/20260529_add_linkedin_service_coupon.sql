ALTER TABLE coupons
  DROP CONSTRAINT IF EXISTS coupons_services_check;

ALTER TABLE coupons
  ADD CONSTRAINT coupons_services_check CHECK (
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
  ) NOT VALID;
