import type { APIRoute } from 'astro';

/**
 * An Astro API endpoint that acts as an image proxy for Supabase Storage.
 * It makes URLs host-agnostic and improves caching.
 */
export const GET: APIRoute = async ({ params }) => {
    const path = params.path;
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

    // 1. Validate that the necessary parts are present.
    if (!path) {
        return new Response('Not Found', { status: 404 });
    }

    if (!supabaseUrl) {
        console.error('Image Proxy Error: `PUBLIC_SUPABASE_URL` is not set in environment variables.');
        return new Response('Image proxy is not configured.', { status: 500 });
    }

    // 2. Construct the full Supabase Storage URL.
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${path}`;

    try {
        // 3. Fetch the image from Supabase Storage.
        const imageResponse = await fetch(imageUrl);

        // 4. If the image isn't found or another error occurs, return a 404.
        if (!imageResponse.ok) {
            return new Response('Not Found', { status: 404 });
        }

        // 5. Forward the original image headers and add aggressive caching.
        const headers = new Headers(imageResponse.headers);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new Response(imageResponse.body, { headers });

    } catch (error) {
        console.error(`Failed to fetch image from Supabase: ${error}`);
        return new Response('Internal Server Error', { status: 500 });
    }
};