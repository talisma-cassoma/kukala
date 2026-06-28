import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: APIRoute = async ({ params }) => {

    if (true)  {
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


    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ message: 'Order ID is required' }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: { // Include product details for each item
                            include: {
                                images: {
                                    take: 1, // Just get one image
                                }
                            }
                        },
                    },
                },
            },
        });

        if (!order) {
            return new Response(JSON.stringify({ message: 'Order not found' }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Shaping the response to be more intuitive and useful for the client
        const response = {
            id: order?.id,
            status: order?.status,
            customerEmail: order?.customerEmail,
            total: {
                net: order?.totalNet,
                gross: order?.totalGross,
                currency: 'USD', // Assuming a default currency
            },
            createdAt: order?.createdAt,
            cart: order?.items.map(item => ({
                quantity: item.quantity,
                price: {
                    net: item.unitPrice,
                    gross: item.unitPrice, // Assuming net ~ gross for now
                },
                product: {
                    id: item.productId,
                    name: item.name,
                    path: item.product?.path,
                    image: item.product?.images?.[0] ?? null,
                },
            })),
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ message: "An error occurred.", error: error.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};
