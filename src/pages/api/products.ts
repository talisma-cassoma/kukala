import type { APIRoute } from 'astro';
import { loadMockFrontPage } from '../../lib/mock-data';

export const GET: APIRoute = async () => {
  const data = await loadMockFrontPage();
  const products = data?.donuts?.children ?? [];

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};
