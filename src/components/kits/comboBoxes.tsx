export function ComboBoxes({ cell }: any) {
  const product = cell;
  const image = product.image;
  const price = product.price;

  return (
    
  <a href={product.path} className="block w-full min-w-200 py-6 lg:py-10 relative">
  <div className="flex flex-row items-center lg:items-stretch w-full">
    
    {/* Conteúdo de Texto */}
    <div className="w-full lg:w-full flex flex-col justify-center rounded-xl bg-[#f0efeb] p-6 lg:pr-10 box-border mt-0 lg:mt-24 border border-gray-200 z-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-normalbreak-words max-w-full lg:max-w-[80%]">
          {product.name}
        </h2>
        <p className="text-base sm:text-lg font-semibold mt-2">${price}</p>
      </div>
    </div>

    {/* Coluna da Imagem */}
    <div className="w-full lg:w-3/4 z-10 -mt-12 lg:mt-0 lg:-ml-60 rounded-xl overflow-hidden flex justify-center pl-0 lg:pl-10">
      <img
        src={image.url}
        alt={image.altText}
        className="w-full h-auto object-contain aspect-1366/745"
      />
    </div>

  </div>
</a>
  );
}