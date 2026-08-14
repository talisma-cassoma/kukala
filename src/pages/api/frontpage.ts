import type { APIRoute } from 'astro';
import { getFrontPageData } from '@/use-cases/queries/frontpage';

export const GET: APIRoute = async () => {
  try {
    const data = await getFrontPageData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('API frontpage error:', error);
    return new Response(JSON.stringify({ message: "An error occurred.", error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
