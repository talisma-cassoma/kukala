import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { getSupabaseClient } from '@/lib/supabase';
import { loadMockFrontPage } from '../../lib/mock-data';

const prisma = new PrismaClient();

function mapProductToCard(product: any) {
    const firstImage = product.defaultVariant?.images?.[0] ?? product.images?.[0] ?? null;
    return {
        id: product.id,
        __typename: 'Product',
        name: product.name,
        path: product.path,
        topics: product.topics ?? [],
        bundle: {
            content: product.isBundle ? { value: true } : null,
        },
        defaultVariant: {
            firstImage: firstImage ? {
                url: firstImage.url,
                altText: firstImage.altText,
                variants: [],
            } : null,
            priceVariant: {
                price: product.defaultVariant?.price ?? 0,
                currency: product.defaultVariant?.currency ?? 'USD',
            },
        },
    };
}

export const GET: APIRoute = async () => {
    if (true) { // fecth no mock
        const data = await loadMockFrontPage();
        const products = data?.donuts?.children ?? [];

        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });
    }
    try {
        const products = await prisma.product.findMany({
            where: {
                published: true, // Only show published products
            },
            include: {
                topics: true,
                images: {
                    take: 1,
                },
                defaultVariant: {
                    include: {
                        images: {
                            take: 1,
                        },
                    },
                },
            },
        });

        const productCards = products.map(mapProductToCard);

        return new Response(JSON.stringify(productCards), {
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

export const POST: APIRoute = async ({ request }) => {

    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ message: 'Authorization header missing' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ message: 'Token missing' }), { status: 401 });
        }

        const supabase = getSupabaseClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return new Response(JSON.stringify({ message: 'Invalid or expired token', error: userError?.message }), { status: 401 });
        }

        if (user.email !== import.meta.env.ADIMN_USER_EMAIL) {
            return new Response(JSON.stringify({ message: 'Forbidden: User is not an admin' }), { status: 403 });
        }

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.slug || !body.path) {
            return new Response(JSON.stringify({ message: 'Missing required product fields: name, slug, path' }), { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                path: body.path,
                type: body.type || 'product',
                published: body.published !== undefined ? body.published : true,
                isBundle: body.isBundle || false,
                summary: body.summary,
                body: body.body,
                nutritionJson: body.nutritionJson,
                relatedProductIds: body.relatedProductIds || [],
            },
        });

        return new Response(JSON.stringify(newProduct), {
            status: 201,
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (error: any) {
        console.error(error);
        // Prisma unique constraint violation
        if (error.code === 'P2002') {
            return new Response(JSON.stringify({ message: `Product with this ${error.meta?.target?.join(', ')} already exists.` }), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: "An error occurred.", error: error.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
