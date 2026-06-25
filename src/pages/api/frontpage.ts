import type { APIRoute } from 'astro';
import { loadMockFrontPage } from '../../lib/mock-data';

export const GET: APIRoute = async () => {
  const data = await loadMockFrontPage();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};
