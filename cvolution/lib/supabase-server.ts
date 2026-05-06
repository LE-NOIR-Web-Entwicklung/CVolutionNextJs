import { createClient } from '@supabase/supabase-js';
import { assertServerSupabaseEnv } from '@/lib/supabase-env';

let supabaseUrl = "";
let supabaseSecretKey = "";

try {
  const env = assertServerSupabaseEnv();
  supabaseUrl = env.url;
  supabaseSecretKey = env.key;
} catch (error) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(error instanceof Error ? error.message : "Supabase ENV fehlt.");
  }
}

export const supabaseAdmin = createClient(
  supabaseUrl || "missing-supabase-url",
  supabaseSecretKey || "missing-supabase-secret-key"
);
