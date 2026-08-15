import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseClientEnv } from '@/lib/supabase-env';

if (!hasSupabaseClientEnv() && process.env.NODE_ENV !== "production") {
  console.warn('Supabase Client ENV fehlt: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (oder Legacy ANON).');
}

export const supabase = createClient<Database>(getSupabaseUrl(), getSupabasePublishableKey());

export const adminSupabase = createClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
  auth: {
    storageKey: 'cvolution-admin-auth',
  },
});
