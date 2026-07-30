import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import type { Product as PrismaProduct, Topic, Image, Paragraph, TableSection, TableProperty, ProductOptionGroup, ProductOption, ProductRelationship } from '@prisma/client';

const prisma = new PrismaClient();

// Define a more specific type for the product data we fetch from Prisma
type FullProduct = PrismaProduct & {
    mainImage: Image | null;
    topics: Topic[];
    bodyParagraphs: (Paragraph & { images: Image[] })[];
    tableSections: (TableSection & { properties: TableProperty[] })[];
    optionGroups: (ProductOptionGroup & { options: ProductOption[] })[];
    relatedTo: (ProductRelationship & { to: PrismaProduct & { mainImage: Image | null, topics: Topic[] } })[];
};

// Maps the deeply nested Prisma product object to the flat structure the frontend expects
function mapProductToContract(product: FullProduct) {
    const price = product.optionGroups
        .flatMap(g => g.options)
        .reduce((min, p) => (p.price < min ? p.price : min), new Decimal(Infinity))
        .toNumber();
        
    return {
        id: product.id,
        name: product.name,
        path: product.path,
        __typename: 'Product',
        topics: product.topics.map(t => ({ name: t.name })),
        image: product.mainImage ? { url: product.mainImage.url, altText: product.mainImage.altText ?? '' } : null,
        price: isFinite(price) ? price : 0,
        summary: product.summary ?? '',
        
        // Map structured content
        body: {
                paragraphs: product.bodyParagraphs.map(p => ({
                    title: { text: p.title ?? '' },
                    body: { json: p.body },
                    images: p.images.map(img => ({ url: img.url, altText: img.altText ?? '' })),
                })),
        },
        table: {
                sections: product.tableSections.map(s => ({
                    title: s.title,
                    properties: s.properties.map(p => ({ key: p.key, value: p.value })),
                })),
        },
        
        // Map configurable options
        productOptions: product.optionGroups.map(g => ({
            id: g.id,
            name: g.name,
            required: g.required,
            options: g.options.map(o => ({
                id: o.id,
                label: o.label,
                price: o.price.toNumber(),
                available: o.available,
            })),
        })),

        // Map related products
        related: {
            content: {
                items: product.relatedTo.map(r => ({
                    id: r.to.id,
                    name: r.to.name,
                    path: r.to.path,
                    __typename: 'Product',
                    image: r.to.mainImage ? { url: r.to.mainImage.url, altText: r.to.mainImage.altText ?? '' } : null,
                    topics: r.to.topics.map(t => ({ name: t.name })),
                    price: 0, // Price for related items can be simplified or fetched if needed
                })),
            },
        },
    };
}


export const GET: APIRoute = async ({ params }) => {
    const { slug } = params;

    if (!slug) {
        return new Response(JSON.stringify({ message: "Product slug is required" }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    try {
        // Fetch the product and all its related content in a single, structured query
        const productFromDb = await prisma.product.findUnique({
            where: { slug, published: true },
            include: {
                mainImage: true,
                topics: true,
                bodyParagraphs: {
                    orderBy: { order: 'asc' },
                    include: { images: true },
                },
                tableSections: {
                    orderBy: { order: 'asc' },
                    include: { properties: { orderBy: { order: 'asc' } } },
                },
                optionGroups: {
                    include: { options: true },
                },
                relatedTo: {
                    include: {
                        to: { // 'to' is the related product
                            include: { mainImage: true, topics: true }
                        }
                    }
                }
            },
        });

        if (!productFromDb) {
            return new Response(JSON.stringify({ message: 'Product not found' }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }
        
        // Map the database result to the frontend contract
        const productForFrontend = mapProductToContract(productFromDb as FullProduct);

        return new Response(JSON.stringify({ product: productForFrontend }), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });

    } catch (error: any) {
        console.error(error);
        const errorMessage = error.message;
        return new Response(JSON.stringify({ message: "An error occurred.", error: errorMessage }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};

// We need to import Decimal to handle the price mapping correctly.
// Prisma uses a custom Decimal type for Decimal fields.
import { Decimal } from '@prisma/client/runtime/library';
