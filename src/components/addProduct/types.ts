export type ProductImage = {
  url: string;
  altText: string;
  variants: Array<Record<string, unknown>>;
};

export type RichTextNode = {
  kind: 'block' | 'inline';
  type?: string;
  metadata?: Record<string, unknown>;
  children?: Array<{
    kind: 'block' | 'inline';
    metadata?: Record<string, unknown>;
    textContent?: string;
  }>;
};

export type ProductTopic = {
  name: string;
};

export type ProductPriceVariant = {
  price: number;
  currency: string;
};

export type ProductParagraphTitle = { text: string } | string | null;

export type ProductParagraph = {
  title: ProductParagraphTitle;
  body: { json: RichTextNode[] };
  images: ProductImage[];
};

export type ProductProperty = {
  key: string;
  value: string;
};

export type ProductVariantAttribute = {
  attribute: string;
  value: string;
};

export type ProductVariantPrice = {
  identifier: string;
  name: string;
  price: number;
  currency: string;
};

export type ProductVariant = {
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

export type RelatedProduct = {
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

export type Product = {
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

export type ProductData = {
  pageTitle: string;
  pageDescription: string;
  product: Product;
};

export type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email';
  min?: string;
  step?: string;
};

export type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};
