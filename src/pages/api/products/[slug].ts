import type { APIRoute } from 'astro';
import { getProductData } from '@/use-cases/queries/product';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ message: "Product slug is required" }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const productData = await getProductData(slug);

    if (!productData) {
      return new Response(JSON.stringify({ message: 'Product not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(productData), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('API product error:', error);
    return new Response(JSON.stringify({ message: "An error occurred.", error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
