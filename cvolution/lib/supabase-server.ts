import { createClient } from '@supabase/supabase-js';
import { getSupabaseSecretKey, getSupabaseUrl, hasSupabaseServerEnv } from '@/lib/supabase-env';

if (!hasSupabaseServerEnv() && process.env.NODE_ENV !== "production") {
  console.warn("Supabase Server ENV fehlt: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY (oder Legacy Fallbacks).");
}

export const supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseSecretKey());
