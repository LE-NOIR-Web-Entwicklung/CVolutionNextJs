-- Orders hold names, e-mail addresses, birth dates, salaries, uploaded CVs and
-- payslips (base64) and the payment status. The original policies from
-- 20260130_create_orders_table.sql let the public anon key read and update
-- every row. All order access now runs server-side with the service role,
-- which bypasses RLS, so the browser roles get no access at all.
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.orders;
DROP POLICY IF EXISTS "Allow read by id" ON public.orders;
DROP POLICY IF EXISTS "Allow update status" ON public.orders;
REVOKE ALL ON public.orders FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.orders TO service_role;

-- Tables that are only ever read through the service role. RLS without
-- policies already blocks them; removing the grants as well means a policy
-- added later by mistake cannot reopen them.
REVOKE ALL ON public.coupons FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_download_grants FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_download_items FROM PUBLIC, anon, authenticated;

-- SECURITY DEFINER functions reachable via /rest/v1/rpc. redeem_coupon is
-- called only by the server (src/lib/coupons.ts); handle_new_user is the
-- auth.users trigger and is never meant to be called directly. Triggers keep
-- firing without EXECUTE for the API roles.
REVOKE EXECUTE ON FUNCTION public.redeem_coupon(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(uuid) TO service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
