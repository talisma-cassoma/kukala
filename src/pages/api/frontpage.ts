import type { APIRoute } from 'astro';
import { PrismaClient, ProductType } from '@prisma/client';
import type { Product, ProductOptionGroup } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// A type guard to check if a product has a main image
type ProductWithImage = Product & { 
    mainImage: { url: string; altText: string | null } | null; 
    topics: { name: string }[];
    optionGroups: (ProductOptionGroup & { options: { price: Decimal }[] })[];
};
function hasImage(product: any): product is ProductWithImage {
    return product.mainImage !== null;
}

// Maps a Prisma Product to the shape expected by the frontend's ProductCard contract
function mapProductToCard(product: ProductWithImage) {
    const price = product.optionGroups
        .flatMap(g => g.options)
        .reduce((min, p) => (p.price.lt(min) ? p.price : min), new Decimal(Infinity))
        .toNumber();

    return {
        id: product.id,
        __typename: 'Product',
        name: product.name,
        path: product.path,
        topics: product.topics.map(t => ({ name: t.name })),
        bundle: null,
        image: {
            url: product.mainImage!.url,
            altText: product.mainImage!.altText ?? '',
        },
        price: isFinite(price) ? price : 0,
    };
}


export const GET: APIRoute = async () => {
    try {
        const productsFromDb = await prisma.product.findMany({
            where: {
                published: true,
            },
            include: {
                mainImage: true,
                topics: true,
                optionGroups: {
                    include: {
                        options: true,
                    },
                },
            },
        });

        // Filter out products that don't have a main image, as they can't be displayed properly
        const validProducts = productsFromDb.filter(hasImage);

        // Group products by their type
        const comboboxes = validProducts
            .filter((p) => p.type === ProductType.COMBOBOX)
            .map(mapProductToCard);

        const discountedBundles = validProducts
            .filter((p) => p.type === ProductType.DISCOUNTED)
            .map(mapProductToCard);
        
        const retailProducts = validProducts
            .filter((p) => p.type === ProductType.RETAIL)
            .map(mapProductToCard);


        // Construct the response in the shape the frontend `Kits` component expects
        const response = {
            comboboxes,
            discountedBundles,
            retailProducts
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
