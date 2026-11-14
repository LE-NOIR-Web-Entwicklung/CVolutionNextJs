-- Supabase advisor 0011 (function_search_path_mutable): pin an empty search_path
-- so a caller cannot shadow objects these functions resolve. All four bodies only
-- use now() (pg_catalog, always searched) or schema-qualified names
-- (handle_new_user writes public.profiles), so their behaviour is unchanged.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.set_blog_posts_updated_at() SET search_path = '';
ALTER FUNCTION public.set_updated_at() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
