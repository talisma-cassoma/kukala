import { TopicsDisplayer } from "../topics-displayer";

export function ComboBoxes({ cell }: any) {
  if (!cell) return null;
  const product = cell;
  const image = product.image || {};
  const price = product.price ?? 0;

  return (
    <a href={product.path} className="block w-full py-4 lg:py-8 box-border overflow-hidden">
      <div className="flex flex-col justify-between lg:flex-row items-center lg:items-stretch w-full h-90 gap-8 relative">
        {/* Conteúdo de Texto */}
        <div className="w-lg flex-1 flex flex-col justify-center rounded-xl bg-[#f0efeb] p-6 lg:p-8 border-4 border-gray-200 z-0 box-content mt-20 lg:mx-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-break-words break-words max-w-full ">
              {product.name}
            </h2>
            <p className="text-base sm:text-lg font-semibold mt-2">{price} DH</p>
          </div>
          <div >
           <TopicsDisplayer topics={product?.topics}  />
          </div>
        </div>

        {/* Coluna da Imagem */}
        {image.url && (
          <div className="absolute lg:right-80 max-w-120 lg:max-w-120 aspect-4/3 w-full lg:w-1/2 z-10 rounded-xl overflow-hidden flex justify-center items-center">
            <img
              src={image.url}
              alt={image.altText || product.name}
              className="object-contain"
            />
          </div>
        )}
      </div>
    </a>
  );
}
