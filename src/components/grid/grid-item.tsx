
export function GridItem({ cell }: any) {
  const product = cell.item;

  const image = product.variants?.[0]?.images?.[0];
  const price = product.variants?.[0]?.price;

  if (cell.layout.colspan === 3) {
    return (
      <a href={product.path}>
        <div className="flex relative lg:flex-row flex-col">
          <img
            src={image.url}
            alt={image.altText}
            className="lg:absolute right-0 bottom-0 lg:w-6/12 rounded-r-xl"
          />

          <div className="flex flex-col w-full justify-evenly h-80 p-5 rounded-xl bg-background1">
            <div>
              <h2 className="text-2xl font-bold">
                {product.name}
              </h2>

              <p>${price}</p>
            </div>

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
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={product.path}>
      <div className="flex flex-col rounded-xl p-5 bg-background3 min-h-[400px]">
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