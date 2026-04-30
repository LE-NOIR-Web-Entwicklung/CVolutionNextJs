import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://umvuqbeuzjqmmudkvscy.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey && process.env.NODE_ENV !== "production") {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Server-side Supabase API calls will fail until it is configured.");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || "missing-supabase-service-role-key"
);
