import fs from 'node:fs/promises';
import nodePath from 'node:path';

const specPath = nodePath.resolve(process.cwd(), "provisioning/tenant/spec.json");
async function loadSpec() {
  const raw = await fs.readFile(specPath, "utf-8");
  return JSON.parse(raw);
}
function getLocalizedValue(value, fallback = "en") {
  if (!value || typeof value !== "object") {
    return value ?? null;
  }
  if (typeof value === "string") {
    return value;
  }
  return value[fallback] ?? value.en ?? value["no-nb"] ?? null;
}
function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function normalizeImage(image) {
  if (!image) {
    return null;
  }
  const variants = Array.isArray(image.variants) ? image.variants.map((variant) => ({
    url: variant.url ?? variant.src,
    key: variant.key ?? variant.src,
    width: variant.width ?? 500,
    height: variant.height ?? 500
  })) : [];
  return {
    url: image.src ?? image.url,
    altText: getLocalizedValue(image.altText),
    variants
  };
}
function isProductItem(item) {
  return item?.shape === "default-product" || item?.shape === "toy";
}
function mapProductToCard(item) {
  const defaultVariant = item.variants?.find((variant) => variant.isDefault) ?? item.variants?.[0];
  const firstImage = defaultVariant?.images?.[0] ? normalizeImage(defaultVariant.images[0]) : null;
  const price = defaultVariant?.price?.default ?? defaultVariant?.price ?? 0;
  const currency = "USD";
  const topics = (item.topics ?? []).map((topic) => ({
    name: getLocalizedValue(topic?.name) ?? topic?.path?.split("/").pop() ?? ""
  })).filter((topic) => topic.name);
  return {
    id: item.externalReference ?? item.cataloguePath ?? item.name?.en,
    __typename: "Product",
    name: getLocalizedValue(item.name),
    path: item.cataloguePath ?? `/shop/${slugify(getLocalizedValue(item.name) ?? "product")}`,
    topics,
    bundle: {
      content: item.components?.bundle ? { value: true } : null
    },
    defaultVariant: {
      firstImage,
      priceVariant: {
        price: Number(price) || 0,
        currency
      }
    }
  };
}
function mapProductToGridItem(item) {
  const card = mapProductToCard(item);
  return {
    name: card.name,
    path: card.path,
    topics: card.topics,
    variants: [
      {
        images: card.defaultVariant?.firstImage ? [card.defaultVariant.firstImage] : [],
        price: card.defaultVariant?.priceVariant?.price ?? 0
      }
    ]
  };
}
function buildFrontPageData(spec) {
  const allItems = (spec.items ?? []).flatMap((item) => [item, ...item.children ?? []]);
  const products = allItems.filter(isProductItem).slice(0, 6);
  const cards = products.map(mapProductToCard);
  const featured = products.slice(0, 4);
  const pageMeta = {
    title: "Kulala",
    description: "One stop shop for buying cosmetic & personal care online.",
    content: {
      chunks: [
        [
          { content: { text: "Kulala" } },
          {
            content: {
              plainText: ["One stop shop for buying cosmetic & personal care online."]
            }
          }
        ]
      ]
    }
  };
  const grid = {
    content: {
      grids: [
        {
          rows: [
            {
              columns: featured.map((product, index) => ({
                layout: {
                  rowspan: 1,
                  colspan: index === 0 ? 3 : 1
                },
                item: mapProductToGridItem(product)
              }))
            }
          ]
        }
      ]
    }
  };
  return {
    page: {
      title: pageMeta.title,
      description: pageMeta.description,
      meta: pageMeta.content
    },
    catalog: {
      grid
    },
    products: cards,
    catalogue: {
      meta: {
        content: pageMeta.content
      },
      grid
    },
    donuts: {
      children: cards
    }
  };
}
function buildProductDetail(spec, pathName) {
  const allItems = (spec.items ?? []).flatMap((item) => [item, ...item.children ?? []]);
  const products = allItems.filter(isProductItem);
  const product = products.find((item) => item.cataloguePath === pathName);
  if (!product) {
    return null;
  }
  const variants = (product.variants ?? []).map((variant) => ({
    id: variant.sku,
    name: getLocalizedValue(variant.name) ?? getLocalizedValue(product.name),
    sku: variant.sku,
    price: variant.price?.default ?? variant.price ?? 0,
    priceVariants: [
      {
        identifier: "default",
        name: "Default",
        price: variant.price?.default ?? variant.price ?? 0,
        currency: "USD"
      }
    ],
    stock: variant.stock?.default ?? 100,
    isDefault: Boolean(variant.isDefault),
    attributes: Object.entries(variant.attributes ?? {}).map(([attribute, value]) => ({
      attribute,
      value
    })),
    images: (variant.images ?? []).map((image2) => normalizeImage(image2))
  }));
  const defaultVariant = variants[0] ?? null;
  const image = defaultVariant?.images?.[0] ?? null;
  const relatedItems = (product.components?.related?.items ?? []).map((item) => {
    const relatedProduct = products.find((candidate) => candidate.externalReference === item.externalReference);
    return relatedProduct ? mapProductToCard(relatedProduct) : null;
  }).filter(Boolean);
  return {
    product: {
      ...mapProductToCard(product),
      summary: {
        content: {
          json: product.components?.brief?.en?.json ?? []
        }
      },
      body: {
        content: {
          paragraphs: (product.components?.body ?? []).map((paragraph) => ({
            title: getLocalizedValue(paragraph.title),
            body: paragraph.body?.en ?? paragraph.body,
            images: (paragraph.images ?? []).map((image2) => normalizeImage(image2))
          }))
        }
      },
      table: {
        content: {
          sections: (product.components?.nutrition ?? []).map((section) => ({
            title: section.title,
            properties: Object.entries(section.properties ?? {}).map(([key, value]) => ({
              key,
              value
            }))
          }))
        }
      },
      related: {
        content: {
          items: relatedItems
        }
      },
      variants,
      defaultVariant: {
        firstImage: image
      }
    }
  };
}
async function loadMockFrontPage() {
  const spec = await loadSpec();
  return buildFrontPageData(spec);
}
async function loadMockProduct(pathName) {
  const spec = await loadSpec();
  return buildProductDetail(spec, pathName);
}

export { loadMockProduct as a, loadMockFrontPage as l };
