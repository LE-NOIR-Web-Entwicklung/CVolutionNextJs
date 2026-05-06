import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase-env';

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_PUBLISHABLE_KEY = getSupabasePublishableKey();

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Supabase ENV fehlt: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (oder Legacy NEXT_PUBLIC_SUPABASE_ANON_KEY).');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const adminSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storageKey: 'cvolution-admin-auth',
  },
});
