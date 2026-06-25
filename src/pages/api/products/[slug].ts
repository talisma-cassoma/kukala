import type { APIRoute } from 'astro';
import { loadMockProduct } from '../../../lib/mock-data';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  const pathName = slug ? `/shop/${slug}` : '';
  const data = await loadMockProduct(pathName);

  if (!data) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};
