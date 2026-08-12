// ProductPreview.tsx
import { ProductView } from "@/components/product";
import type { ProductBodyType } from "@/use-cases/contracts/ProductContent";
import type { Product as ProductType } from "@/use-cases/contracts/Product";


export function ProductPreview({productData}: {productData:  {
  pageTitle: string;
  pageDescription: string;
  product: ProductBodyType & ProductType;
};

}) {
    return (
      <div className="lg:container mx-auto w-full h-full lg:px-0 px-5">
    {
      productData ? (
        <ProductView product={productData.product}/>
      ) : (
        <p>Product not found</p>
      )
    }
  </div>
    );
}