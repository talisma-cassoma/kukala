import type { APIRoute, GetStaticPaths } from 'astro';

/**
 * An Astro API endpoint that acts as an image proxy for Supabase Storage.
 * It makes URLs host-agnostic and improves caching.
 * This version redirects to the actual image URL for better performance.
 */
export const GET: APIRoute = async ({ params, redirect }) => {
    const path = params.path;
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

    // 1. Validate that the necessary parts are present.
    if (!path) {
        return new Response('Image path not provided', { status: 400 });
    }

    if (!supabaseUrl) {
        console.error('Image Proxy Error: `PUBLIC_SUPABASE_URL` is not set in environment variables.');
        return new Response('Image proxy is not configured', { status: 500 });
    }

    // 2. Construct the full Supabase Storage URL.
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${path}`;

    // 3. Redirect (307 - Temporary Redirect) to the actual image URL.
    // This lets the browser cache the image from the Supabase CDN directly.
    return redirect(imageUrl, 307);
};