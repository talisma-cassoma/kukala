import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ProductPreview } from '@/components/ProductPreview';

type ProductImage = {
  url: string;
  altText: string;
  variants: Array<Record<string, unknown>>;
};

type RichTextNode = {
  kind: 'block' | 'inline';
  type?: string;
  metadata?: Record<string, unknown>;
  children?: Array<{
    kind: 'block' | 'inline';
    metadata?: Record<string, unknown>;
    textContent?: string;
  }>;
};

type ProductTopic = {
  name: string;
};

type ProductPriceVariant = {
  price: number;
  currency: string;
};

type ProductParagraphTitle = { text: string } | string | null;

type ProductParagraph = {
  title: ProductParagraphTitle;
  body: { json: RichTextNode[] };
  images: ProductImage[];
};

type ProductProperty = {
  key: string;
  value: string;
};

type ProductVariantAttribute = {
  attribute: string;
  value: string;
};

type ProductVariantPrice = {
  identifier: string;
  name: string;
  price: number;
  currency: string;
};

type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  priceVariants: ProductVariantPrice[];
  stock: number;
  isDefault: boolean;
  attributes: ProductVariantAttribute[];
  images: ProductImage[];
};

type RelatedProduct = {
  id: string;
  __typename: string;
  name: string;
  path: string;
  topics: ProductTopic[];
  bundle: { content: null };
  defaultVariant: {
    firstImage: ProductImage | null;
    priceVariant: ProductPriceVariant;
  };
};

type Product = {
  id: string;
  __typename: string;
  name: string;
  path: string;
  topics: ProductTopic[];
  bundle: { content: null };
  summary: { content: { json: RichTextNode[] } };
  body: { content: { paragraphs: ProductParagraph[] } };
  table: { content: { sections: Array<{ title: string | null; properties: ProductProperty[] }> } };
  related: { content: { items: RelatedProduct[] } };
  defaultVariant: {
    firstImage: ProductImage | null;
    priceVariant: ProductPriceVariant;
  };
  variants: ProductVariant[];
};

type ProductData = {
  pageTitle: string;
  pageDescription: string;
  product: Product;
};

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email';
  min?: string;
  step?: string;
};

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

const createEmptyProduct = (): ProductData => ({
  pageTitle: 'Fresh product draft',
  pageDescription: 'Create a rich product experience with flexible content sections.',
  product: {
    id: 'product-draft',
    __typename: 'Product',
    name: 'Chocolate Dream',
    path: '/shop/chocolate-dream',
    topics: [{ name: 'new' }, { name: 'limited-edition' }],
    bundle: { content: null },
    summary: {
      content: {
        json: [
          {
            kind: 'block',
            type: 'paragraph',
            metadata: {},
            children: [
              {
                kind: 'inline',
                metadata: {},
                textContent: 'A rich chocolate experience with a soft crumb and a glossy finish.'
              }
            ]
          }
        ]
      }
    },
    body: {
      content: {
        paragraphs: [
          {
            title: { text: 'Our signature donut' },
            body: {
              json: [
                {
                  kind: 'block',
                  type: 'paragraph',
                  metadata: {},
                  children: [
                    {
                      kind: 'inline',
                      metadata: {},
                      textContent: 'Bake fresh, glaze generously, and serve with a smile.'
                    }
                  ]
                }
              ]
            },
            images: []
          }
        ]
      }
    },
    table: {
      content: {
        sections: [
          {
            title: 'Nutrition',
            properties: [
              { key: 'Calories', value: '143 kj' },
              { key: 'Protein', value: '2.4 g' }
            ]
          }
        ]
      }
    },
    related: {
      content: {
        items: [
          {
            id: 'related-product-1',
            __typename: 'Product',
            name: 'Strawberry blast',
            path: '/shop/strawberry-blast',
            topics: [{ name: 'limited-edition' }, { name: 'glazed' }],
            bundle: { content: null },
            defaultVariant: {
              firstImage: {
                url: 'https://crystallize.com',
                altText: 'Strawberry donut',
                variants: []
              },
              priceVariant: { price: 6, currency: 'USD' }
            }
          }
        ]
      }
    },
    defaultVariant: {
      firstImage: {
        url: 'https://crystallize.com',
        altText: 'Chocolate donut',
        variants: []
      },
      priceVariant: { price: 8, currency: 'USD' }
    },
    variants: [
      {
        id: 'variant-1',
        name: 'Chocolate Dream',
        sku: 'chocolate-dream-1',
        price: 8,
        priceVariants: [
          { identifier: 'default', name: 'Default', price: 8, currency: 'USD' }
        ],
        stock: 37,
        isDefault: true,
        attributes: [{ attribute: 'Donut size', value: 'M' }],
        images: []
      }
    ]
  }
});

const buildParagraphJson = (text: string): RichTextNode[] => [
  {
    kind: 'block',
    type: 'paragraph',
    metadata: {},
    children: [
      {
        kind: 'inline',
        metadata: {},
        textContent: text
      }
    ]
  }
];

const SectionCard = ({ title, description, children }: SectionCardProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const TextField = ({ label, value, onChange, placeholder, required = false, type = 'text', min, step }: TextFieldProps) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      min={min}
      step={step}
      required={required}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    />
  </label>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4 }: TextAreaFieldProps) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    />
  </label>
);

export function ProductRegistrationWizard() {
  const [productData, setProductData] = useState<ProductData>(createEmptyProduct());
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [paragraphImageFiles, setParagraphImageFiles] = useState<Record<number, File | null>>({});

  const getValue = <T,>(path: string, source: ProductData = productData): T =>
    path.split('.').reduce<any>((accumulator, key) => accumulator?.[key], source) as T;

  const setValue = (path: string, value: unknown) => {
    setProductData((previous) => {
      const next = structuredClone(previous);
      const segments = path.split('.');
      let cursor: Record<string, unknown> = next as Record<string, unknown>;

      segments.slice(0, -1).forEach((segment) => {
        if (cursor[segment] === undefined || cursor[segment] === null) {
          cursor[segment] = {};
        }
        cursor = cursor[segment] as Record<string, unknown>;
      });

      cursor[segments[segments.length - 1]] = value;
      return next;
    });
  };

  const getParagraphTitleText = (paragraph: ProductParagraph) =>
    typeof paragraph.title === 'string' ? paragraph.title : paragraph.title?.text ?? '';

  const updateSummary = (value: string) => {
    setValue('product.summary.content.json', buildParagraphJson(value));
  };

  const handleMainImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setMainImageFile(file);
    setValue('product.defaultVariant.firstImage', {
      url: previewUrl,
      altText: file.name,
      variants: []
    });
  };

  const handleParagraphImageChange = (paragraphIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setParagraphImageFiles((previous) => ({ ...previous, [paragraphIndex]: file }));
    setValue(`product.body.content.paragraphs.${paragraphIndex}.images`, [
      {
        url: previewUrl,
        altText: file.name,
        variants: []
      }
    ]);
  };

  const addParagraph = () => {
    const paragraphs = getValue<ProductParagraph[]>('product.body.content.paragraphs');
    setValue('product.body.content.paragraphs', [
      ...paragraphs,
      {
        title: { text: 'New section' },
        body: { json: buildParagraphJson('Describe this section.') },
        images: []
      }
    ]);
  };

  const removeParagraph = (index: number) => {
    const paragraphs = getValue<ProductParagraph[]>('product.body.content.paragraphs');
    setValue('product.body.content.paragraphs', paragraphs.filter((_, paragraphIndex) => paragraphIndex !== index));
  };

  const addNutritionRow = () => {
    const sections = getValue<Array<{ title: string; properties: ProductProperty[] }>>('product.table.content.sections');
    const nextSections = [...sections];
    nextSections[0] = {
      ...nextSections[0],
      properties: [...nextSections[0].properties, { key: 'New field', value: 'Value' }]
    };
    setValue('product.table.content.sections', nextSections);
  };

  const removeNutritionRow = (index: number) => {
    const sections = getValue<Array<{ title: string; properties: ProductProperty[] }>>('product.table.content.sections');
    const nextSections = [...sections];
    nextSections[0] = {
      ...nextSections[0],
      properties: nextSections[0].properties.filter((_, propertyIndex) => propertyIndex !== index)
    };
    setValue('product.table.content.sections', nextSections);
  };

  const addVariant = () => {
    const variants = getValue<ProductVariant[]>('product.variants');
    const nextVariant: ProductVariant = {
      id: `variant-${variants.length + 1}`,
      name: 'New variant',
      sku: `new-variant-${variants.length + 1}`,
      price: 0,
      priceVariants: [{ identifier: 'default', name: 'Default', price: 0, currency: 'USD' }],
      stock: 0,
      isDefault: false,
      attributes: [{ attribute: 'Size', value: 'M' }],
      images: []
    };
    setValue('product.variants', [...variants, nextVariant]);
  };

  const removeVariant = (index: number) => {
    const variants = getValue<ProductVariant[]>('product.variants');
    setValue('product.variants', variants.filter((_, variantIndex) => variantIndex !== index));
  };

  const addRelatedProduct = () => {
    const relatedItems = getValue<RelatedProduct[]>('product.related.content.items');
    setValue('product.related.content.items', [
      ...relatedItems,
      {
        id: `related-${relatedItems.length + 1}`,
        __typename: 'Product',
        name: 'New related product',
        path: '/shop/new-related-product',
        topics: [{ name: 'trending' }],
        bundle: { content: null },
        defaultVariant: {
          firstImage: null,
          priceVariant: { price: 0, currency: 'USD' }
        }
      }
    ]);
  };

  const removeRelatedProduct = (index: number) => {
    const relatedItems = getValue<RelatedProduct[]>('product.related.content.items');
    setValue('product.related.content.items', relatedItems.filter((_, relatedIndex) => relatedIndex !== index));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Ready to save product:', JSON.stringify(productData, null, 2));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard
            title="General information"
            description="Set the core product metadata and storefront fields."
          >
            <TextField
              label="Product name"
              value={getValue<string>('product.name')}
              onChange={(value) => setValue('product.name', value)}
              placeholder="Chocolate Dream"
              required
            />
            <TextField
              label="Path / slug"
              value={getValue<string>('product.path')}
              onChange={(value) => setValue('product.path', value)}
              placeholder="/shop/chocolate-dream"
              required
            />
            <TextField
              label="Page title"
              value={productData.pageTitle}
              onChange={(value) => setValue('pageTitle', value)}
              placeholder="Chocolate Dream"
            />
            <TextField
              label="Page description"
              value={productData.pageDescription}
              onChange={(value) => setValue('pageDescription', value)}
              placeholder="A rich chocolate experience for your storefront."
            />
            <TextField
              label="Topics"
              value={getValue<ProductTopic[]>('product.topics').map((topic) => topic.name).join(', ')}
              onChange={(value) => setValue('product.topics', value.split(',').map((topic) => topic.trim()).filter(Boolean).map((name) => ({ name })))}
              placeholder="new, limited-edition"
            />
          </SectionCard>

          <SectionCard
            title="Image"
            description="Upload a main image and keep the file object separate from the preview payload."
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Main image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            {mainImageFile ? (
              <p className="text-sm text-slate-500">Selected file: {mainImageFile.name}</p>
            ) : null}
            {getValue<ProductImage | null>('product.defaultVariant.firstImage') ? (
              <img
                src={getValue<ProductImage | null>('product.defaultVariant.firstImage')?.url}
                alt={getValue<ProductImage | null>('product.defaultVariant.firstImage')?.altText ?? 'Product preview'}
                className="h-48 w-full rounded-xl object-cover"
              />
            ) : null}
          </SectionCard>

          <SectionCard
            title="Summary"
            description="The summary is converted to the nested JSON shape expected by the renderer."
          >
            <TextAreaField
              label="Summary text"
              value={((getValue<RichTextNode[]>('product.summary.content.json')[0]?.children?.[0]?.textContent as string | undefined) ?? '')}
              onChange={(value) => updateSummary(value)}
              placeholder="Describe the product in a short, polished way."
              rows={6}
            />
          </SectionCard>

          <SectionCard
            title="Body"
            description="Compose paragraphs, update their text, and add images per section."
          >
            {getValue<ProductParagraph[]>('product.body.content.paragraphs').map((paragraph, index) => (
              <div key={`${getParagraphTitleText(paragraph)}-${index}`} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">Paragraph {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Title"
                  value={getParagraphTitleText(paragraph)}
                  onChange={(value) => setValue(`product.body.content.paragraphs.${index}.title`, { text: value })}
                />
                <TextAreaField
                  label="Body"
                  value={((paragraph.body.json[0] as RichTextNode | undefined)?.children?.[0]?.textContent ?? '')}
                  onChange={(value) => setValue(`product.body.content.paragraphs.${index}.body.json`, buildParagraphJson(value))}
                  rows={5}
                />
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Paragraph image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleParagraphImageChange(index, event)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                {paragraphImageFiles[index] ? <p className="text-sm text-slate-500">Selected file: {paragraphImageFiles[index]?.name}</p> : null}
                {paragraph.images[0] ? (
                  <img src={paragraph.images[0].url} alt={paragraph.images[0].altText} className="mt-3 h-40 w-full rounded-lg object-cover" />
                ) : null}
              </div>
            ))}
            <button
              type="button"
              onClick={addParagraph}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Add paragraph
            </button>
          </SectionCard>

          <SectionCard
            title="Nutrition"
            description="Maintain the nutrition table as dynamic key/value rows."
          >
            {getValue<Array<{ title: string; properties: ProductProperty[] }>>('product.table.content.sections')[0]?.properties.map((property, index) => (
              <div key={`${property.key}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <TextField
                  label="Key"
                  value={property.key}
                  onChange={(value) => setValue(`product.table.content.sections.0.properties.${index}.key`, value)}
                />
                <TextField
                  label="Value"
                  value={property.value}
                  onChange={(value) => setValue(`product.table.content.sections.0.properties.${index}.value`, value)}
                />
                <button
                  type="button"
                  onClick={() => removeNutritionRow(index)}
                  className="self-end rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNutritionRow}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Add row
            </button>
          </SectionCard>

          <SectionCard
            title="Variants"
            description="Manage price, stock, and attributes in a dynamic array of variants."
          >
            {getValue<ProductVariant[]>('product.variants').map((variant, index) => (
              <div key={`${variant.sku}-${index}`} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">Variant {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField label="Name" value={variant.name} onChange={(value) => setValue(`product.variants.${index}.name`, value)} />
                  <TextField label="SKU" value={variant.sku} onChange={(value) => setValue(`product.variants.${index}.sku`, value)} />
                  <TextField label="Price" value={String(variant.price)} onChange={(value) => setValue(`product.variants.${index}.price`, Number(value))} type="number" min="0" step="0.01" />
                  <TextField label="Stock" value={String(variant.stock)} onChange={(value) => setValue(`product.variants.${index}.stock`, Number(value))} type="number" min="0" step="1" />
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-slate-700">Attributes</p>
                  {variant.attributes.map((attribute, attributeIndex) => (
                    <div key={`${attribute.attribute}-${attributeIndex}`} className="grid gap-3 md:grid-cols-2">
                      <TextField
                        label="Attribute"
                        value={attribute.attribute}
                        onChange={(value) => setValue(`product.variants.${index}.attributes.${attributeIndex}.attribute`, value)}
                      />
                      <TextField
                        label="Value"
                        value={attribute.value}
                        onChange={(value) => setValue(`product.variants.${index}.attributes.${attributeIndex}.value`, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Add variant
            </button>
          </SectionCard>

          <SectionCard
            title="Related products"
            description="List products that should appear alongside this product in the storefront."
          >
            {getValue<RelatedProduct[]>('product.related.content.items').map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">Related product {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeRelatedProduct(index)}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField
                    label="Name"
                    value={item.name}
                    onChange={(value) => setValue(`product.related.content.items.${index}.name`, value)}
                  />
                  <TextField
                    label="Path"
                    value={item.path}
                    onChange={(value) => setValue(`product.related.content.items.${index}.path`, value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRelatedProduct}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Add related product
            </button>
          </SectionCard>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Generate final JSON
          </button>
        </form>

        <aside className="space-y-6">
          <SectionCard title="Live preview" description="The preview renders from the same product object used for submission.">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <ProductPreview productData={productData} />
            </div>
          </SectionCard>

          <SectionCard title="Final JSON payload" description="This object is ready to save to your database.">
            <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
              {JSON.stringify(productData, null, 2)}
            </pre>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
