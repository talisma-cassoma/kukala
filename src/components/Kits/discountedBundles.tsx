
export function DscountedBundles({ cell }: any) {
  const product = cell.item;

  const image = product.variants?.[0]?.images?.[0];
  const price = product.variants?.[0]?.price;
     return (
    <a href={product.path}>
      <div className="flex flex-col rounded-xl p-5 bg-red-50 min-h-[400px]">
        <div className="flex justify-between">
          <div className="flex gap-1">
            {product.topics?.map((topic: any) => (
              <span
                key={topic.name}
                className="text-sm bg-grey px-3 py-1 rounded-xl"
              >
                {topic.name}
              </span>
            ))}
          </div>

          <p>${price}</p>
        </div>

        <img
          src={image.url}
          alt={image.altText}
          className="mx-auto"
        />

        <h2 className="text-2xl font-bold text-center mt-auto">
          {product.name}
        </h2>
      </div>
    </a>
  );
  }