import { PrismaClient } from '@prisma/client';
import type {
  Product as PrismaProduct,
  Topic,
  Image,
  Paragraph,
  TableSection,
  TableProperty,
  ProductOptionGroup,
  ProductOption,
  ProductRelationship,
} from '@prisma/client';
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

type FullProduct = PrismaProduct & {
  mainImage: Image | null;
  topics: Topic[];
  bodyParagraphs: (Paragraph & { images: Image[] })[];
  tableSections: (TableSection & { properties: TableProperty[] })[];
  optionGroups: (ProductOptionGroup & { options: ProductOption[] })[];
  relatedTo: (ProductRelationship & { to: PrismaProduct & { mainImage: Image | null; topics: Topic[] } })[];
};

function mapProductToContract(product: FullProduct) {
  const price = product.optionGroups
    .flatMap((g) => g.options)
    .reduce((min, p) => (p.price.lt(min) ? p.price : min), new Decimal(Infinity))
    .toNumber();

  return {
    id: product.id,
    name: product.name,
    path: product.path,
    __typename: 'Product',
    topics: product.topics.map((t) => ({ name: t.name })),
    image: product.mainImage
      ? { url: product.mainImage.url, altText: product.mainImage.altText ?? product.name }
      : null,
    price: isFinite(price) ? price : 0,
    summary: product.summary ?? '',

    body: {
      paragraphs: product.bodyParagraphs.map((p) => ({
        title: { text: p.title ?? '' },
        text: typeof p.body === 'string' ? p.body : JSON.stringify(p.body ?? ''),
        images: p.images.map((img) => ({ url: img.url, altText: img.altText ?? '' })),
        videos: [],
      })),
    },
    table: {
      sections: product.tableSections.map((s) => ({
        title: s.title,
        properties: s.properties.map((p) => ({ key: p.key, value: p.value })),
      })),
    },

    productOptions: product.optionGroups.map((g) => ({
      id: g.id,
      name: g.name,
      required: g.required,
      options: g.options.map((o) => ({
        id: o.id,
        label: o.label,
        price: o.price.toNumber(),
        available: o.available,
      })),
    })),

    related: {
      items: product.relatedTo.map((r) => ({
        id: r.to.id,
        name: r.to.name,
        path: r.to.path,
        __typename: 'Product',
        image: r.to.mainImage
          ? { url: r.to.mainImage.url, altText: r.to.mainImage.altText ?? r.to.name }
          : null,
        topics: r.to.topics.map((t) => ({ name: t.name })),
        price: 0,
      })),
    },
  };
}

function getMockProduct(slugOrPath: string) {
  const cleanSlug = slugOrPath.replace(/^\/shop\//, '').replace(/^\//, '');
  const found = (mockProducts as any[]).find(
    (p) => p.path === `/shop/${cleanSlug}` || p.path === cleanSlug || p.path.endsWith(`/${cleanSlug}`)
  );

  if (!found) {
    return null;
  }

  const imageUrl = found.image?.url && found.image.url.startsWith('http')
    ? found.image.url
    : `/products/${cleanSlug}/thumbnail.png`;

  const paragraphs = (found.body?.paragraphs ?? []).map((p: any, pIdx: number) => ({
    title: typeof p.title === 'string' ? { text: p.title } : (p.title ?? { text: '' }),
    text: p.text ?? '',
    images: (p.images ?? []).map((img: any, iIdx: number) => ({
      url: img.url && img.url.startsWith('http') ? img.url : `/products/${cleanSlug}/body/${iIdx}.webp`,
      altText: img.altText ?? found.name,
    })),
    videos: p.videos ?? [],
  }));

  const relatedItems = (found.related?.items ?? []).map((r: any) => {
    const rSlug = r.path?.split('/').pop() || '';
    return {
      name: r.name,
      path: r.path,
      topics: r.topics ?? [],
      price: r.defaultVariant?.price ?? 65,
      image: {
        url: `/products/${rSlug}/thumbnail.png`,
        altText: r.name,
      },
    };
  });

  return {
    product: {
      id: cleanSlug,
      name: found.name,
      path: found.path,
      __typename: 'Product',
      topics: found.topics ?? [],
      image: {
        url: imageUrl,
        altText: found.image?.altText ?? found.name,
      },
      price: typeof found.price === 'number' ? found.price : (Number(found.price) || 0),
      summary: found.summary ?? '',
      body: {
        paragraphs,
      },
      table: found.table ?? { sections: [] },
      productOptions: found.productOptions ?? [],
      related: {
        items: relatedItems,
      },
    },
  };
}

export async function getProductData(slugOrPath: string) {
  const cleanSlug = slugOrPath.replace(/^\/shop\//, '').replace(/^\//, '');
  const client = getPrisma();

  if (client) {
    try {
      const productFromDb = await client.product.findUnique({
        where: { slug: cleanSlug, published: true },
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
              to: {
                include: { mainImage: true, topics: true },
              },
            },
          },
        },
      });

      if (productFromDb) {
        return { product: mapProductToContract(productFromDb as FullProduct) };
      }
    } catch (error) {
      console.warn(`Database query for product ${cleanSlug} failed, falling back to mock:`, error);
    }
  }

  return getMockProduct(cleanSlug);
}

export async function fetchProduct(pathOrSlug: string, origin?: string) {
  if (typeof window === 'undefined' || !origin) {
    return await getProductData(pathOrSlug);
  }

  const slug = pathOrSlug.replace('/shop/', '').replace(/^\//, '');
  try {
    const response = await fetch(`${origin}/api/products/${slug}`);
    if (!response.ok) {
      return getMockProduct(slug);
    }
    return await response.json();
  } catch {
    return getMockProduct(slug);
  }
}
