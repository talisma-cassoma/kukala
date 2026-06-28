
export function ComboBoxes({ cell }: any) {
  const product = cell.item;

  const image = product.variants?.[0]?.images?.[0];
  const price = product.variants?.[0]?.price;
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
          </div>
        </div>
      </a>
    );
}