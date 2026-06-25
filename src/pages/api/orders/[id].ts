import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;

  return new Response(
    JSON.stringify({
      id,
      orders: {
        get: {
          id,
          cart: [],
          total: { net: 0, gross: 0 },
        },
      },
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};
