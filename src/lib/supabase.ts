import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

/**
 * Returns a shared Supabase client instance for client-side and server-side use.
 * This uses the public anonymous key and is safe to use in browsers.
 */
export function getSupabaseClient() {
  if (client) return client;

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  client = createClient(url, anonKey, {
     auth: {
       persistSession: true,
       autoRefreshToken: true,
       detectSessionInUrl: true,
     },
  });

  return client;
}
