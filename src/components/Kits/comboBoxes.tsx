export function ComboBoxes({ cell }: any) {
  const product = cell;
  const image = product.image;
  const price = product.price;

  return (
    <a href={product.path} className="block w-240 py-10 relative">
      <div className="flex flex-col lg:flex-row items-stretch h-64">
        
        {/* Conteúdo de Texto (Vem primeiro para ficar à esquerda) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center rounded-xl bg-white p-6 pr-10 border border-gray-100 z-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h2>
            <p className="text-lg font-semibold mt-2">${price}</p>
          </div>
        </div>

        {/* Coluna da Imagem (À direita, sobrepondo alguns pixels à esquerda) */}
        <div className="w-full lg:w-1/2 z-10 lg:-ml-24 rounded-xl overflow-hidden flex">
          <img
            src={image.url}
            alt={image.altText}
            className="w-full h-full object-cover aspect-1366/745"
          />
        </div>

      </div>
    </a>
  );
}