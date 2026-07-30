import type { APIRoute } from 'astro';
import { PrismaClient, ProductType, type ProductOptionGroup, type ProductOption } from '@prisma/client';
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
    // 1. --- AUTHENTICATION ---
    // (Keeping the existing authentication logic)
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

        // 2. --- BODY PARSING & VALIDATION ---
        const body = await request.json();

        // Basic field validation
        if (!body.name || !body.slug || !body.path || !body.type) {
            return new Response(JSON.stringify({ message: 'Missing required fields: name, slug, path, type' }), { status: 400 });
        }

        // Enum validation for ProductType
        if (!Object.values(ProductType).includes(body.type)) {
            return new Response(JSON.stringify({ message: `Invalid product type. Must be one of: ${Object.values(ProductType).join(', ')}` }), { status: 400 });
        }

        // 3. --- DATABASE TRANSACTION ---
        const newProduct = await prisma.product.create({
            data: {
                // --- Direct Fields ---
                name: body.name,
                slug: body.slug,
                path: body.path,
                type: body.type,
                summary: body.summary || null,
                published: body.published !== undefined ? body.published : false,

                // --- Relational: Main Image (Create) ---
                mainImage: body.mainImage ? {
                    create: {
                        url: body.mainImage.url,
                        altText: body.mainImage.altText,
                    }
                } : undefined,

                // --- Relational: Topics (Connect) ---
                topics: body.topics ? {
                    connect: body.topics.map((topic: { id: string }) => ({ id: topic.id }))
                } : undefined,

                // --- Relational: Body Paragraphs (Create) ---
                bodyParagraphs: body.bodyParagraphs ? {
                    create: body.bodyParagraphs.map((p: any, index: number) => ({
                        title: p.title,
                        body: p.body,
                        order: p.order ?? index,
                        images: p.images ? {
                            create: p.images.map((img: any) => ({
                                url: img.url,
                                altText: img.altText,
                            }))
                        } : undefined,
                    }))
                } : undefined,
                
                // --- Relational: Table Sections (Create) ---
                tableSections: body.tableSections ? {
                    create: body.tableSections.map((s: any, index: number) => ({
                        title: s.title,
                        order: s.order ?? index,
                        properties: s.properties ? {
                            create: s.properties.map((prop: any, propIndex: number) => ({
                                key: prop.key,
                                value: prop.value,
                                order: prop.order ?? propIndex,
                            }))
                        } : undefined,
                    }))
                } : undefined,

                // --- Relational: Product Options (Create) ---
                optionGroups: body.optionGroups ? {
                    create: body.optionGroups.map((group: any) => ({
                        name: group.name,
                        required: group.required,
                        options: group.options ? {
                            create: group.options.map((option: any) => ({
                                label: option.label,
                                price: option.price,
                                available: option.available,
                            }))
                        } : undefined,
                    }))
                } : undefined,

                // --- Relational: Related Products (Connect) ---
                relatedTo: body.relatedProducts ? {
                    create: body.relatedProducts.map((relatedId: string) => ({
                        to: {
                            connect: { id: relatedId }
                        }
                    }))
                } : undefined,
            },
            // Include all the newly created data in the response
            include: {
                mainImage: true,
                topics: true,
                bodyParagraphs: { include: { images: true } },
                tableSections: { include: { properties: true } },
                optionGroups: { include: { options: true } },
                relatedTo: { include: { to: true } }
            }
        });

        // 4. --- RESPONSE ---
        return new Response(JSON.stringify(newProduct), {
            status: 201,
            headers: { 'content-type': 'application/json' },
        });

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            const target = error.meta?.target as string[] | undefined;
            return new Response(JSON.stringify({ message: `A product with this ${target?.join(', ') ?? 'value'} already exists.` }), {
                status: 409, // Conflict
                headers: { 'content-type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ message: "An error occurred while creating the product.", error: error.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}


