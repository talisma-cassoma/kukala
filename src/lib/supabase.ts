import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;
let adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (client) return client;

 const url =
    import.meta?.env?.PUBLIC_SUPABASE_URL ??
    process.env.PUBLIC_SUPABASE_URL;


const anonKey =
    import.meta?.env?.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY;

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

export function getSupabaseAdmin() {
    if (adminClient) return adminClient;

    const url = process.env.PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error("Supabase admin environment variables are missing.");
    }
    adminClient = createClient(url, serviceKey);
    return adminClient;
}
