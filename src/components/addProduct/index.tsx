
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ProductPreview } from '@/components/ProductPreview';
import type {
  ProductProperty, ProductData, ProductParagraph,
  ProductVariant, RelatedProduct, ProductTopic, ProductImage, RichTextNode,
} from "@/components/addProduct/types"
import { createEmptyProduct, buildParagraphJson } from "@/components/addProduct/shared"
import { TextField } from "@/components/addProduct/textField"
import { TextAreaField } from "@/components/addProduct/textAreaField"
import { SectionCard } from "@/components/addProduct/sectionCard"
import { LoginDialog } from '../login';
import { getSupabaseClient } from '@/lib/supabase';
import {relatedProducts} from "@/components/product"

export function AddNewProduct() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [productData, setProductData] = useState<ProductData>(createEmptyProduct());
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [paragraphImageFiles, setParagraphImageFiles] = useState<Record<number, File | null>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);


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
    const relatedItems = getValue<RelatedProduct[]>('relatedProducts.content.items');
    setValue('relatedProducts.content.items', [
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
    const relatedItems = getValue<RelatedProduct[]>('relatedProducts.content.items');
    setValue('relatedProducts.content.items', relatedItems.filter((_, relatedIndex) => relatedIndex !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('User not authenticated:', sessionError?.message);
        alert('Please log in to add a product.');
        return;
      }
      const accessToken = session.access_token;

      // A bucket "product-images" must exist in your Supabase project.
      const BUCKET_NAME = 'product-images';
      const updatedProductData = structuredClone(productData);

      // Upload main image
      if (mainImageFile) {
        const filePath = `public/product-main-${Date.now()}-${mainImageFile.name}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, mainImageFile);
        if (uploadError) throw new Error(`Failed to upload main image: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        if (updatedProductData.product.defaultVariant.firstImage) {
          updatedProductData.product.defaultVariant.firstImage.url = publicUrl;
        }
      }

      // Upload paragraph images
      for (const indexStr in paragraphImageFiles) {
        const index = parseInt(indexStr, 10);
        const file = paragraphImageFiles[index];
        if (file) {
          const filePath = `public/product-paragraph-${index}-${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);
          if (uploadError) throw new Error(`Failed to upload paragraph image ${index + 1}: ${uploadError.message}`);
          
          const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
          if (updatedProductData.product.body.content.paragraphs[index]?.images[0]) {
            updatedProductData.product.body.content.paragraphs[index].images[0].url = publicUrl;
          }
        }
      }

      const pathSegments = updatedProductData.product.path.split('/');
      const slug = pathSegments[pathSegments.length - 1] || updatedProductData.product.path;

      const payload = {
        name: updatedProductData.product.name,
        path: updatedProductData.product.path,
        slug: slug,
        type: 'product',
        published: true,
        isBundle:false,
        summary: JSON.stringify(updatedProductData.product.summary.content.json),
        body: JSON.stringify(updatedProductData.product.body.content.paragraphs),
        nutritionJson: updatedProductData.product.table.content.sections,
        relatedProductIds: relatedProducts.content.items.map(item => item.id),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newProduct = await response.json();
        console.log('Product added successfully:', newProduct);
        alert('Product added successfully! Make sure you have a "product-images" bucket in your Supabase project.');
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to add product: ${errorData.message}`);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="box-border h-screenHeight p-8 bg-slate-50 text-slate-900">
      {!isAuthenticated &&
        <LoginDialog setIsAuthenticated={setIsAuthenticated} />
      }
      <div className="box-border h-full mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-6 overflow-scroll h-full no-scrollbar">
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
            {getValue<RelatedProduct[]>('relatedProducts.content.items').map((item, index) => (
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
                    onChange={(value) => setValue(`relatedProducts.content.items.${index}.name`, value)}
                  />
                  <TextField
                    label="Path"
                    value={item.path}
                    onChange={(value) => setValue(`relatedProducts.content.items.${index}.path`, value)}
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
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Generate final JSON'}
          </button>
        </form>

        <aside className="space-y-6 box-border p-4 h-full overflow-scroll no-scrollbar">
          <div className="rounded-2xl border border-slate-200 bg-primary p-4 overflow-scroll no-scrollbar">
            <ProductPreview productData={productData} />
          </div>
        </aside>
      </div>
    </div>
  );
}
