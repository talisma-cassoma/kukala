// ProductPreview.tsx
import { Product as CrystallizeProduct } from "@/components/product";


export function ProductPreview({productData}: {productData: any}) {
    return (
      <div className="lg:container mx-auto w-full lg:px-0 px-5">
    {
      productData ? (
        <CrystallizeProduct product={productData.product}/>
      ) : (
        <p>Product not found</p>
      )
    }
  </div>
    );
}