import type { APIRoute } from 'astro';
import { PrismaClient, type OrderStatus } from '@prisma/client';
import { requireAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

export const GET: APIRoute = async (context) => {
    // 1. Authenticate and authorize the administrator
    const adminUserOrResponse = await requireAdmin(context);
    if (adminUserOrResponse instanceof Response) {
        return adminUserOrResponse;
    }
    const { params } = context;

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

        //console.log("Fetched order from DB:", JSON.stringify(order));
        
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
            customer: {
                firstName: order?.firstName,
                lastName: order?.lastName,
                email: order?.email,
                phone: order?.phone,
                street: order?.street,
                city: order?.city,
                postalCode: order?.postalCode,
            },

            total: {
                net: order?.totalNet,
                gross: order?.totalGross,
                currency: 'USD', // Assuming a default currency
            },
            createdAt: order?.createdAt,
            cart: order?.items.map(item => ({
                quantity: item.quantity,
                name: item.name, // Add the name directly to the cart item
                price: {
                    net: item.unitPrice,
                    gross: item.unitPrice, // Assuming net ~ gross for now
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

export const PATCH: APIRoute = async (context) => {
    const adminUserOrResponse = await requireAdmin(context);
    if (adminUserOrResponse instanceof Response) {
        return adminUserOrResponse;
    }
    const { params, request } = context;
    const { id } = params;
    const body = await request.json();

    if (!id) {
        return new Response(JSON.stringify({ message: 'Order ID is required' }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    const { status, price, name, order } = body;

    const dataToUpdate: {
        status?: OrderStatus;
        totalGross?: number;
        firstName?: string;
        lastName?: string;
    } = {};

    if (status) dataToUpdate.status = status;
    if (price) dataToUpdate.totalGross = parseFloat(price);
    if (name) {
        const [firstName, ...lastName] = name.split(' ');
        dataToUpdate.firstName = firstName;
        dataToUpdate.lastName = lastName.join(' ');
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: dataToUpdate,
        });

        return new Response(JSON.stringify(updatedOrder), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ message: "An error occurred while updating the order.", error: error.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};

export const DELETE: APIRoute = async (context) => {
    const adminUserOrResponse = await requireAdmin(context);
    if (adminUserOrResponse instanceof Response) {
        return adminUserOrResponse;
    }
    const { params } = context;
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ message: 'Order ID is required' }), { status: 400 });
    }

    try {
        await prisma.order.delete({ where: { id } });
        return new Response(null, { status: 204 });
    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ message: "An error occurred while deleting the order.", error: error.message }), { status: 500 });
    }
};