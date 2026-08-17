import type { APIContext } from "astro";
import { createClient, type User } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_USER_ID = import.meta.env.ADMIN_USER_ID;

if (!ADMIN_USER_ID) {
    // This check should be more specific if you have other server-side env vars
    if (import.meta.env.PROD) {
        throw new Error("Missing required environment variable: ADMIN_USER_ID");
    }
}

/**
 * A server-side helper to protect API routes by requiring an authenticated admin user.
 * It checks for a valid Supabase session and verifies if the user is the designated admin.
 *
 * @param context The Astro API context.
 * @returns A Promise that resolves with the authenticated admin User object or a Response object for redirection.
 */
export async function requireAdmin({ request }: APIContext): Promise<User | Response> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ message: 'Unauthorized: Missing or invalid token' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);
     //console.log("user id:", user?.id)

    if (error || !user) {
        return new Response(JSON.stringify({ message: 'Unauthorized: Invalid session' }), { status: 401 });
    }

    // Authorization check: Is the authenticated user the administrator?
    if (user.id !== ADMIN_USER_ID) {
        return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    // If all checks pass, return the user object
    return user;
}