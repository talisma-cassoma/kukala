
import { TopicsDisplayer } from "@/components/topics-displayer";

export function DiscountedBundles({ cell }: any) {
  const product = cell;

  const image = product.image;
  const price = product.price;
  return (
    <a href={product.path}
      className="flex flex-col pb-[4rem] lg:bg-background3 rounded-xl lg:h-96 p-5 lg:w-[300px w-full box-border">
      <div className="grid grid-rows-[auto_1fr_auto] h-full gap-4">
      
        <div className="flex justify-between items-start">
          <TopicsDisplayer topics={product?.topics} />
          <p className="font-bold">${price}</p>
        </div>

        <div className="flex items-center justify-center min-h-0 w-full">
          <img
            src={image.url}
            alt={image.altText}
            srcSet={`${image.url}?w=200 200w, ${image.url}?w=300 300w`}
            sizes="(max-width: 700px) 200px, 300px"
            loading="lazy"
            className="w-full  aspect-[500/434] object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mx-auto w-40">
          {product?.name}
        </h2>
      </div>

    </a>
  );
}