import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { getSupabaseAdmin } from '@/lib/supabase';

const prisma = new PrismaClient();

// IMPORTANT: Secure your webhook with a secret token.
const WEBHOOK_SECRET = import.meta.env.WEBHOOK_SECRET || 'YOUR_SECRET_TOKEN';

export const POST: APIRoute = async ({ request }) => {
    // 1. Security Check
    const token = request.headers.get('x-webhook-secret');
    if (token !== WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Invalid secret token' }), { status: 401 });
    }

    try {
        const formData = await request.formData();
        
        // 2. Parse Incoming Product Data
        // The 'product' field is expected to be a JSON string containing all product info.
        // Example: { name: "My Product", slug: "my-product", path: "/shop/my-product", price: 10.99, ... }
        const productPayload = JSON.parse((formData.get('product') as string) || '{}');
        const relatedProductSlugs: string[] = productPayload.relatedProducts || [];

        if (!productPayload.slug) {
            return new Response(JSON.stringify({ error: 'Product slug is required' }), { status: 400 });
        }

        // 3. Handle Image Uploads (if any)
        const files = formData.getAll('images') as File[];
        const supabaseAdmin = getSupabaseAdmin();
        const imageUrls = await Promise.all(
            files.map(async (file, index) => {
                const safeName = `${productPayload.slug}-${Date.now()}-${index}-${file.name.replace(/\s+/g, '-')}`;
                const { error } = await supabaseAdmin.storage.from('products').upload(safeName, file, { upsert: true, contentType: file.type });
                if (error) throw error;
                const { data } = supabaseAdmin.storage.from('products').getPublicUrl(safeName);
                return { id: safeName, url: data.publicUrl, altText: productPayload.name }; // Return object for prisma create
            })
        );

        // 4. Prepare Data for Prisma
        // This is where you map the incoming payload to your Prisma schema.
        // This is a simplified example; you'll need to expand it for variants, topics, etc.
        const productData = {
            name: productPayload.name,
            slug: productPayload.slug,
            path: productPayload.path || `/shop/${productPayload.slug}`,
            published: productPayload.published ?? true,
            type: productPayload.type || 'product',
            summary: productPayload.summary || undefined,
            body: productPayload.body || undefined,
            // ... add other product fields here
        };

        // Find related products by their slugs to get their IDs
        const relatedProducts = await prisma.product.findMany({
            where: {
                slug: { in: relatedProductSlugs },
            },
            select: { id: true },
        });
        const relatedProductIds = relatedProducts.map(p => p.id);

        // 5. Use a transaction to ensure data integrity
        const savedProduct = await prisma.$transaction(async (tx) => {
            // First, upsert the product itself
            const product = await tx.product.upsert({
                where: { slug: productPayload.slug },
                update: {
                    ...productData,
                    images: {
                        deleteMany: {}, // Clear old images
                        create: imageUrls,
                    },
                    mainImage: imageUrls.length > 0 ? {
                        connect: { id: imageUrls[0].id }
                    }: undefined,
                },
                create: {
                    ...productData,
                    images: {
                        create: imageUrls,
                    },
                    mainImage: imageUrls.length > 0 ? {
                        connect: { id: imageUrls[0].id }
                    } : undefined,
                },
            });

            // Then, clear old relationships for this product
            await tx.productRelationship.deleteMany({
                where: { fromId: product.id },
            });

            // And create the new ones, now with the correct `fromId`
            if (relatedProductIds.length > 0) {
                await tx.productRelationship.createMany({
                    data: relatedProductIds.map(relatedId => ({
                        fromId: product.id,
                        toId: relatedId,
                    })),
                });
            }

            return product;
        });

        return new Response(JSON.stringify({
            message: 'Webhook processed successfully',
            product: savedProduct 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error';
        console.error("Webhook Error:", error);
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
