import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { loadMockProduct } from '../../../lib/mock-data';

const prisma = new PrismaClient();

// Re-usable function to format product data into cards
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


export const GET: APIRoute = async ({ params }) => {

  if (true) { //fecth no mock por agora
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
    }



    const { slug } = params;

    if (!slug) {
        return new Response(JSON.stringify({ message: "Product slug is required" }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                topics: true,
                images: true, // All images for the product
                variants: {
                    include: {
                        images: true, // All images for each variant
                    },
                },
            },
        });

        if (!product || product===null) {
            return new Response(JSON.stringify({ message: 'Product not found' }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }
        
        // Fetch related products if there are any IDs
        let relatedItems: any[] = [];
        if (product?.relatedProductIds && (product?.relatedProductIds?.length?? 0) > 0) {
            const relatedProducts = await prisma.product.findMany({
                where: {
                    id: { in: product?.relatedProductIds },
                    published: true,
                },
                include: {
                    topics: true,
                    images: { take: 1 },
                    defaultVariant: {
                        include: {
                            images: { take: 1 },
                        },
                    },
                },
            });
            relatedItems = relatedProducts.map(mapProductToCard);
        }

        // The mock data has a complex shape. We replicate it here.
        // The `body`, `summary`, and `nutritionJson` fields are assumed to contain
        // JSON that matches the structure your frontend expects.
        const response = {
            product: {
                ...mapProductToCard(product),
                summary: {
                    content: {
                        json: product?.summary ? JSON.parse(product?.summary?? "" ) : [],
                    },
                },
                body: {
                    content: {
                        paragraphs: product?.body ? JSON.parse(product?.body ?? "") : [],
                    },
                },
                table: {
                    content: {
                        sections: product?.nutritionJson ?? [],
                    },
                },
                related: {
                    content: {
                        items: relatedItems,
                    },
                },
                variants: product?.variants.map(variant => ({
                    id: variant.id,
                    name: variant.name,
                    sku: variant.sku,
                    price: variant.price,
                    priceVariants: [{ // This structure seems redundant but matches mock
                        identifier: 'default',
                        name: 'Default',
                        price: variant.price,
                        currency: variant.currency,
                    }],
                    stock: variant.stock,
                    isDefault: variant.isDefault,
                    attributes: variant.attributes,
                    images: variant.images.map(image => ({
                        url: image.url,
                        altText: image.altText,
                        key: image.key,
                        width: image.width,
                        height: image.height,
                        variants: [], // Not nesting variants
                    })),
                })),
                defaultVariant: { // Override the one from mapProductToCard
                    firstImage: product?.images?.[0] ?? product?.variants?.[0]?.images?.[0] ?? null,
                },
            },
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error(error);
        const errorMessage = error instanceof SyntaxError ? "Error parsing content from database." : error.message;
        return new Response(JSON.stringify({ message: "An error occurred.", error: errorMessage }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};
