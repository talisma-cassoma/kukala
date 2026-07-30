import type { ProductType } from "../use-cases/contracts/ProductCard";
import { ProductCard } from "./product-card";

export const Products = ({
    donuts,
}: {
    donuts: { children: ProductType[] };
}) => {
    return (
        <div className="mt-20">
            <p className="text-lg font-semibold mb-10">Our donuts</p>
            <div className="flex flex-wrap gap-5">
                {donuts?.children?.map((donut: any, index: number) => (
                    <ProductCard product={donut} key={index} />
                ))}
            </div>
        </div>
    );
};
