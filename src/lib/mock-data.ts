import fs from 'node:fs/promises';
import path from 'node:path';

const specPath = path.resolve(process.cwd(), 'provisioning/tenant/spec.json');

async function loadSpec() {
  const raw = await fs.readFile(specPath, 'utf-8');
  return JSON.parse(raw);
}

function getLocalizedValue(value: any, fallback = 'en') {
  if (!value || typeof value !== 'object') {
    return value ?? null;
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[fallback] ?? value.en ?? value['no-nb'] ?? null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeImage(image: any) {
  if (!image) {
    return null;
  }

  const variants = Array.isArray(image.variants)
    ? image.variants.map((variant: any) => ({
        url: variant.url ?? variant.src,
        key: variant.key ?? variant.src,
        width: variant.width ?? 500,
        height: variant.height ?? 500,
      }))
    : [];

  return {
    url: image.src ?? image.url,
    altText: getLocalizedValue(image.altText),
    variants,
  };
}

function isProductItem(item: any) {
  return item?.shape === 'default-product' || item?.shape === 'toy';
}

function mapProductToCard(item: any) {
  const defaultVariant = item.variants?.find((variant: any) => variant.isDefault) ?? item.variants?.[0];
  const firstImage = defaultVariant?.images?.[0] ? normalizeImage(defaultVariant.images[0]) : null;
  const price = defaultVariant?.price?.default ?? defaultVariant?.price ?? 0;
  const currency = 'USD';
  const topics = (item.topics ?? [])
    .map((topic: any) => ({
      name: getLocalizedValue(topic?.name) ?? topic?.path?.split('/').pop() ?? '',
    }))
    .filter((topic: any) => topic.name);

  return {
    id: item.externalReference ?? item.cataloguePath ?? item.name?.en,
    __typename: 'Product',
    name: getLocalizedValue(item.name),
    path: item.cataloguePath ?? `/shop/${slugify(getLocalizedValue(item.name) ?? 'product')}`,
    topics,
    bundle: {
      content: item.components?.bundle ? { value: true } : null,
    },
    defaultVariant: {
      firstImage,
      priceVariant: {
        price: Number(price) || 0,
        currency,
      },
    },
  };
}

function mapProductToGridItem(item: any) {
  const card = mapProductToCard(item);
  return {
    name: card.name,
    path: card.path,
    topics: card.topics,
    variants: [
      {
        images: card.defaultVariant?.firstImage ? [card.defaultVariant.firstImage] : [],
        price: card.defaultVariant?.priceVariant?.price ?? 0,
      },
    ],
  };
}

function buildFrontPageData(spec: any) {
  const allItems = (spec.items ?? []).flatMap((item: any) => [item, ...(item.children ?? [])]);
  const products = allItems.filter(isProductItem).slice(0, 6);
  const cards = products.map(mapProductToCard);
  const featured = products.slice(0, 4);

  const pageMeta = {
    title: 'Kulala',
    description: 'One stop shop for buying cosmetic & personal care online.',
    content: {
      chunks: [
        [
          { content: { text: 'Kulala' } },
          {
            content: {
              plainText: ['One stop shop for buying cosmetic & personal care online.'],
            },
          },
        ],
      ],
    },
  };

  const grid = {
  content: {
    // Lista linear e direta, sem rows ou columns
    products: featured.map((product: any) => mapProductToGridItem(product)),
  },
};

  return {
    page: {
      title: pageMeta.title,
      description: pageMeta.description,
      meta: pageMeta.content,
    },
    catalog: {
      grid,
    },
    products: cards,
    catalogue: {
      meta: {
        content: pageMeta.content,
      },
      grid,
    },
    donuts: {
      children: cards,
    },
  };
}

function buildProductDetail(spec: any, pathName: string) {
  const allItems = (spec.items ?? []).flatMap((item: any) => [item, ...(item.children ?? [])]);
  const products = allItems.filter(isProductItem);
  const product = products.find((item: any) => item.cataloguePath === pathName);

  if (!product) {
    return null;
  }

  const variants = (product.variants ?? []).map((variant: any) => ({
    id: variant.sku,
    name: getLocalizedValue(variant.name) ?? getLocalizedValue(product.name),
    sku: variant.sku,
    price: variant.price?.default ?? variant.price ?? 0,
    priceVariants: [
      {
        identifier: 'default',
        name: 'Default',
        price: variant.price?.default ?? variant.price ?? 0,
        currency: 'USD',
      },
    ],
    stock: variant.stock?.default ?? 100,
    isDefault: Boolean(variant.isDefault),
    attributes: Object.entries(variant.attributes ?? {}).map(([attribute, value]) => ({
      attribute,
      value,
    })),
    images: (variant.images ?? []).map((image: any) => normalizeImage(image)),
  }));

  const defaultVariant = variants[0] ?? null;
  const image = defaultVariant?.images?.[0] ?? null;
  const relatedItems = (product.components?.related?.items ?? [])
    .map((item: any) => {
      const relatedProduct = products.find((candidate: any) => candidate.externalReference === item.externalReference);
      return relatedProduct ? mapProductToCard(relatedProduct) : null;
    })
    .filter(Boolean);

  return {
    product: {
      ...mapProductToCard(product),
      summary: {
        content: {
          json: product.components?.brief?.en?.json ?? [],
        },
      },
      body: {
        content: {
          paragraphs: (product.components?.body ?? []).map((paragraph: any) => ({
            title: getLocalizedValue(paragraph.title),
            body: paragraph.body?.en ?? paragraph.body,
            images: (paragraph.images ?? []).map((image: any) => normalizeImage(image)),
          })),
        },
      },
      table: {
        content: {
          sections: (product.components?.nutrition ?? []).map((section: any) => ({
            title: section.title,
            properties: Object.entries(section.properties ?? {}).map(([key, value]) => ({
              key,
              value,
            })),
          })),
        },
      },
      related: {
        content: {
          items: relatedItems,
        },
      },
      variants,
      defaultVariant: {
        firstImage: image,
      },
    },
  };
}

export async function loadMockFrontPage() {
  const spec = await loadSpec();
  return buildFrontPageData(spec);
}

export async function loadMockProduct(pathName: string) {
  const spec = await loadSpec();
  return buildProductDetail(spec, pathName);
}
