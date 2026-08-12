import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductPreview } from '@/components/ProductPreview';
import { LoginDialog } from '@/components/login';
import { CreateProductForm } from './form';
import { productFormSchema, type ProductFormData } from '@/components/addProduct/form/schema';
import type { Product as ProductType } from '@/use-cases/contracts/Product';
import type { ProductBodyType } from '@/use-cases/contracts/ProductContent';
import type { Image } from '@/use-cases/contracts/Image';

// This function transforms the form data into the structure ProductPreview expects.
const transformFormDataToPreviewData = (formData: Partial<ProductFormData>): {
  pageTitle: string;
  pageDescription: string;
  product: ProductBodyType & ProductType;
} => {
  // Map form `mainImage` to `image`
  const image: Image = formData.mainImage || { url: '', altText: 'Placeholder', file: undefined };

  //console.log('Transforming form data to preview data:', JSON.stringify(formData));

  return {
    pageTitle: formData.name || "Product Name",
    pageDescription: formData.summary || "Product description...",
    product: {
      // Mocked/default values that are not in the form but required by types
      id: 'preview-id',
      __typename: 'Product',
      price: 0, 
      related: { items: [] },
      bundle: { content: { value: false }},
      
      // Values from the form
      name: formData.name || '',
      slug: formData.slug || '',
      path: formData.path || '',
      type: formData.type || 'RETAIL',
      summary: formData.summary || '',
      // Ensure topics conform to expected shape { name: string }
      topics: (formData.topics || []).map((t) => ({
        name: ((t as any)?.name as string) ?? ((t as any)?.id as string) ?? '',
      })),
      
      // Map mainImage from form to image
      image: image,
      // Transformed nested structures based on updated contracts
      body: {
        paragraphs: (formData.bodyParagraphs || []).map(p => ({
          title: { text: p.title || '' },
          text: p.text || '', // Use 'text' property as per the updated Paragraph contract
          images: p.images || [],
        })),
      },
      table: {
        sections: (formData.tableSections || []).map(s => ({
          title: s.title,
          properties: s.properties || [],
        })),
      },
      productOptions: (formData.optionGroups || []).map((og) => ({
        id: og.name,
        name: og.name,
        required: og.required,
        options: (og.options || []).map((option, index) => ({
          id: (option as { id?: string }).id ?? `${og.name}-${index}`,
          label: option.label,
          price: option.price,
          available: option.available,
        })),
      })),
    } as ProductBodyType & ProductType,
  };
};


export function AddNewProduct() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 1. Initialize useForm with a more complete set of default values
  const formMethods = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      path: '',
      type: 'RETAIL',
      published: true,
      topics: [],
      summary: '',
      mainImage: { url: '', altText: '' },
      bodyParagraphs: [],
      tableSections: [],
      optionGroups: [],
      relatedProducts: []
    }
  });

  // 2. Watch for all form changes in real-time
  const formData = formMethods.watch();
  console.log("FORM DATA", formData);

  // 3. Transform the data on every render for the preview
  const previewData = transformFormDataToPreviewData(formData);

  return (
    <div className="box-border h-screenHeight p-8 bg-slate-50 text-slate-900">
      {/* {!isAuthenticated && (
        <LoginDialog setIsAuthenticated={setIsAuthenticated} />
      )}
       */}
      <div className="box-border h-full mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.4fr_0.6fr]">
        
        {/* 4. Pass the form methods down to the form component */}
        <CreateProductForm formMethods={formMethods} />
        
        <aside className="space-y-6 box-border p-4 h-full overflow-scroll no-scrollbar">
          <div className="rounded-2xl border border-slate-200 bg-primary p-4 overflow-scroll no-scrollbar">
            {/* 5. The preview now receives correctly structured data and updates automatically */}
            <ProductPreview productData={previewData} />
          </div>
        </aside>
      </div>
    </div>
  );
}