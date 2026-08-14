export function ComboBoxes({ cell }: any) {
  if (!cell) return null;
  const product = cell;
  const image = product.image || {};
  const price = product.price ?? 0;

  return (
    <a href={product.path} className="block w-full py-4 lg:py-8 relative">
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch w-full gap-4">
        {/* Conteúdo de Texto */}
        <div className="w-full flex-1 flex flex-col justify-center rounded-xl bg-[#f0efeb] p-6 lg:p-8 border border-gray-200 z-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words max-w-full">
              {product.name}
            </h2>
            <p className="text-base sm:text-lg font-semibold mt-2">${price}</p>
          </div>
        </div>

        {/* Coluna da Imagem */}
        {image.url && (
          <div className="w-full lg:w-1/2 z-10 rounded-xl overflow-hidden flex justify-center items-center">
            <img
              src={image.url}
              alt={image.altText || product.name}
              className="w-full max-h-60 object-contain"
            />
          </div>
        )}
      </div>
    </a>
  );
}
