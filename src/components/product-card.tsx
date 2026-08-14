import type { ProductType } from "@/use-cases/contracts/ProductCard";
import { TopicsDisplayer } from "./topics-displayer";

export const ProductCard = ({ product }: { product?: ProductType | null }) => {
    if (!product) return null;

    const price = product.price ?? 0;
    const image = product.image;

    return (
        <a
            href={product.path}
            className="flex flex-col overflow-hidden bg-[#d6e2e9] rounded-xl p-5 w-full min-w-42  hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <TopicsDisplayer topics={product.topics} />
                    <p className="self-end font-semibold text-text">
                        {price} DH
                    </p>
                </div>
                <div className="flex justify-center items-center box-border overflow-hidden w-full h-48 lg:h-56 rounded-xl">
                    {image?.url && (
                        <img
                            src={image.url}
                            alt={image.altText || product.name}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain mx-auto"
                        />
                    )}
                </div>
                <h2 className="text-lg font-bold text-center mx-auto max-w-full truncate text-text">
                    {product.name}
                </h2>
            </div>
        </a>
    );
};
