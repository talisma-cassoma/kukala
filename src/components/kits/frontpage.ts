import type { APIRoute } from 'astro';
import { fetchFrontPage } from '@/use-cases/queries/frontpage';

export const GET: APIRoute = async ({ request }) => {
    try {
        const origin = new URL(request.url).origin;
        const data = await fetchFrontPage(origin);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch front page data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
    }
};