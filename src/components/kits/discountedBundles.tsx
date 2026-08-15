import { TopicsDisplayer } from "@/components/topics-displayer";

export function DiscountedBundles({ cell }: any) {
  if (!cell) return null;
  const product = cell;
  const image = product.image || {};
  const price = product.price ?? 0;

  return (
    <a
      href={product.path}
      className="flex flex-col p-6 bg-[#d6e2e9] rounded-xl h-full min-w-42 lg:w-full box-border hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col justify-between h-full gap-4">
        <div className="flex justify-between items-start flex-wrap gap-0">
          <TopicsDisplayer topics={product?.topics} />
          <p className="font-bold text-text">{price} DH</p>
        </div>

        <div className="flex items-center justify-center min-h-40 w-full">
          {image.url && (
            <img
              src={image.url}
              alt={image.altText || product.name}
              loading="lazy"
              className="max-h-48 w-full object-contain"
            />
          )}
        </div>

        <h2 className="text-lg font-bold text-center mx-auto max-w-full truncate text-text">
          {product?.name}
        </h2>
      </div>
    </a>
  );
}
