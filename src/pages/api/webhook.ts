import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

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

        if (!productPayload.slug) {
            return new Response(JSON.stringify({ error: 'Product slug is required' }), { status: 400 });
        }

        // 3. Handle Image Uploads (if any)
        const files = formData.getAll('images') as File[];
        const imageUrls = await Promise.all(
            files.map(async (file, index) => {
                const safeName = `${productPayload.slug}-${Date.now()}-${index}-${file.name.replace(/\s+/g, '-')}`;
                const { error } = await supabaseAdmin.storage.from('products').upload(safeName, file, { upsert: true, contentType: file.type });
                if (error) throw error;
                const { data } = supabaseAdmin.storage.from('products').getPublicUrl(safeName);
                return { url: data.publicUrl, altText: productPayload.name }; // Return object for prisma create
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
            summary: productPayload.summary ? JSON.stringify(productPayload.summary) : undefined,
            body: productPayload.body ? JSON.stringify(productPayload.body) : undefined,
            // ... add other product fields here
        };

        // 5. Upsert Product and Images to Database
        const savedProduct = await prisma.product.upsert({
            where: { slug: productPayload.slug },
            update: {
                ...productData,
                images: {
                    // For updates, you might want to delete old images first
                    // or decide on a different strategy. Here we just add new ones.
                    create: imageUrls,
                },
            },
            create: {
                ...productData,
                images: {
                    create: imageUrls,
                },
                // You would also create variants, topics, etc. here
            },
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
