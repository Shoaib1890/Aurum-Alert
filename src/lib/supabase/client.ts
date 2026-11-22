/**
 * Supabase client configuration module.
 * In Phase 1, external connection is intentionally unconfigured.
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  // Will initialize createClient from @supabase/supabase-js in Phase 2
  return null;
}
