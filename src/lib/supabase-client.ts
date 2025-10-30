import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // IMPORTANT: These are client-side environment variables.
  // They must be prefixed with NEXT_PUBLIC_.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
