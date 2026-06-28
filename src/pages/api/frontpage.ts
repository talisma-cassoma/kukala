import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { loadMockFrontPage } from '../../lib/mock-data';

// It's a good practice to instantiate PrismaClient once and reuse it across your app.
// Consider creating a file like `src/lib/prisma.ts` to export a single instance.
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
                variants: [], // variants are not loaded for cards
            } : null,
            priceVariant: {
                price: product.defaultVariant?.price ?? 0,
                currency: product.defaultVariant?.currency ?? 'USD',
            },
        },
    };
}

export const GET: APIRoute = async () => {

     if (true) { //fecth no mock por agora
        const data = await loadMockFrontPage();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });
    }

    try {
        const pageData = await prisma.page.findUnique({
            where: {
                slug: 'frontpage', // Assuming your frontpage has this slug
            },
            include: {
                gridItems: {
                    orderBy: {
                        order: 'asc',
                    },
                    include: {
                        topics: true,
                    },
                },
                products: {
                    take: 6, // Limit to 6 products for the frontpage display
                    include: {
                        topics: true,
                        images: {
                            take: 1,
                        },
                        defaultVariant: {
                            include: {
                                images: {
                                    take: 1,
                                }
                            }
                        }
                    },
                },
                sections: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
        });

        if (!pageData) {
            return new Response(JSON.stringify({ message: "Frontpage not found" }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        const productCards = pageData?.products.map(mapProductToCard);

        // This shapes the data to look like the original mock data structure.
        // You might want to simplify this structure in the future.
        const response = {
            page: {
                title: pageData?.title,
                description: pageData?.description,
                meta: {
                    content: {
                        chunks: [
                            [
                                { content: { text: pageData?.heroText ?? pageData?.title } },
                                { content: { plainText: [pageData?.description] } },
                            ],
                        ],
                    }
                }
            },
            catalog: {
                grid: {
                    content: {
                        grids: [{
                            rows: [{
                                columns: (pageData?.gridItems ?? []).map(item => ({
                                    layout: { rowspan: item.rowspan, colspan: item.colspan },
                                    item: {
                                        name: item.name,
                                        path: item.path,
                                        topics: item.topics ?? [],
                                        variants: [{
                                            images: item.imageUrl ? [{ url: item.imageUrl, altText: item.imageAlt, variants: [] }] : [],
                                            price: item.price ?? 0,
                                        }],
                                    }
                                })),
                            }],
                        }],
                    },
                },
            },
            products: productCards,
            catalogue: {
                meta: {
                    content: {
                        chunks: [
                            [{ content: { text: pageData?.title } }],
                        ],
                    },
                },
                grid: {
                    content: {
                        grids: [{
                            rows: [{
                                columns: (pageData?.gridItems ?? []).map(item => ({
                                    layout: { rowspan: item.rowspan, colspan: item.colspan },
                                    item: {
                                        name: item.name,
                                        path: item.path,
                                        topics: item.topics ?? [],
                                        variants: [{
                                            images: item.imageUrl ? [{ url: item.imageUrl, altText: item.imageAlt, variants: [] }] : [],
                                            price: item.price ?? 0,
                                        }],
                                    }
                                })),
                            }],
                        }],
                    },
                },
            },
            donuts: {
                children: productCards
            }
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
