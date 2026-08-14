import { createClient } from "@supabase/supabase-js";

let adminClient: ReturnType<typeof createClient> | null = null;

/**
 * Returns a Supabase client configured for admin-level access.
 * This function is for SERVER-SIDE USE ONLY.
 * It uses the `SUPABASE_SERVICE_ROLE_KEY` and must never be exposed to the client.
 */
export function getSupabaseAdmin() {
    if (adminClient) return adminClient;

    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error("Supabase admin environment variables are missing.");
    }
    adminClient = createClient(url, serviceKey);
    return adminClient;
}