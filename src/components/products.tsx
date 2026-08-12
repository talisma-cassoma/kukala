import type { ProductType } from "@/use-cases/contracts/ProductCard";
import { ProductCard } from "./product-card";

export const Products = ({
    elements,
}: {
    elements: { children: ProductType[] };
}) => {
    return (
       <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1, 1fr)",
                gap: "1rem",
                justifyContent: "center"
            }}
        >
            <p className="text-lg font-semibold my-10">outras ofertas</p>
            <div className="flex flex-wrap justify-between self-center gap-8 w-full">
                {elements?.children?.map((element: any, index: number) => (
                    <ProductCard product={element} key={index} />
                ))}
            </div>
        </div>
    );
};
