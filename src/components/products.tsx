import type { ProductType } from "@/use-cases/contracts/ProductCard";
import { ProductCard } from "./product-card";

export const Products = ({
    elements,
}: {
    elements?: { children: ProductType[] } | null;
}) => {
    const products = elements?.children ?? [];

    if (!products || products.length === 0) {
        return null;
    }

    return (
       <div className="w-full my-8">
            <p className="text-2xl font-bold text-text my-6">Autres produits</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {products.map((element: any, index: number) => (
                    <ProductCard product={element} key={element?.id || index} />
                ))}
            </div>
        </div>
    );
};
