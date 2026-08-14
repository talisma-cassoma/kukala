import { PrismaClient, ProductType } from '@prisma/client';
import type { Product, ProductOptionGroup } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import mockProducts from '@/mock/products.json';

let prisma: PrismaClient | null = null;
function getPrisma() {
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch {
      prisma = null;
    }
  }
  return prisma;
}

type ProductWithImage = Product & {
  mainImage: { url: string; altText: string | null } | null;
  topics: { name: string }[];
  optionGroups: (ProductOptionGroup & { options: { price: Decimal }[] })[];
};

function hasImage(product: any): product is ProductWithImage {
  return product.mainImage !== null;
}

function mapProductToCard(product: ProductWithImage) {
  const price = product.optionGroups
    .flatMap((g) => g.options)
    .reduce((min, p) => (p.price.lt(min) ? p.price : min), new Decimal(Infinity))
    .toNumber();

  return {
    id: product.id,
    __typename: 'Product',
    name: product.name,
    path: product.path,
    topics: product.topics.map((t) => ({ name: t.name })),
    bundle: null,
    image: {
      url: product.mainImage!.url,
      altText: product.mainImage!.altText ?? product.name,
    },
    price: isFinite(price) ? price : 0,
  };
}

function getMockFrontPageData() {
  const formatMock = (p: any) => {
    const slug = p.path.split('/').pop() || '';
    const imageUrl = p.image?.url && p.image.url.startsWith('http')
      ? p.image.url
      : `/products/${slug}/thumbnail.png`;

    return {
      id: slug,
      __typename: 'Product',
      name: p.name,
      path: p.path,
      topics: p.topics ?? [],
      bundle: p.bundle?.content ?? null,
      image: {
        url: imageUrl,
        altText: p.image?.altText ?? p.name,
      },
      price: typeof p.price === 'number' ? p.price : (Number(p.price) || 0),
    };
  };

  const comboboxes = (mockProducts as any[])
    .filter((p) => p.type === 'COMBOBOX')
    .map(formatMock);

  const discountedBundles = (mockProducts as any[])
    .filter((p) => p.type === 'DISCOUNTED')
    .map(formatMock);

  const retailProducts = (mockProducts as any[])
    .filter((p) => p.type === 'RETAIL')
    .map(formatMock);

  return {
    comboboxes,
    discountedBundles,
    retailProducts,
  };
}

export async function getFrontPageData() {
  const client = getPrisma();
  if (client) {
    try {
      const productsFromDb = await client.product.findMany({
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

      if (productsFromDb && productsFromDb.length > 0) {
        const validProducts = productsFromDb.filter(hasImage);
        const comboboxes = validProducts
          .filter((p) => p.type === ProductType.COMBOBOX)
          .map(mapProductToCard);

        const discountedBundles = validProducts
          .filter((p) => p.type === ProductType.DISCOUNTED)
          .map(mapProductToCard);

        const retailProducts = validProducts
          .filter((p) => p.type === ProductType.RETAIL)
          .map(mapProductToCard);

        return {
          comboboxes,
          discountedBundles,
          retailProducts,
        };
      }
    } catch (error) {
      console.warn('Database fetch failed, falling back to mock catalog:', error);
    }
  }

  return getMockFrontPageData();
}

export async function fetchFrontPage(origin?: string) {
  if (typeof window === 'undefined' || !origin) {
    return await getFrontPageData();
  }

  try {
    const response = await fetch(`${origin}/api/frontpage`);
    if (!response.ok) {
      return getMockFrontPageData();
    }
    return await response.json();
  } catch {
    return getMockFrontPageData();
  }
}
