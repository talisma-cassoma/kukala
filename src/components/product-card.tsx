import type { ProductType } from "@/use-cases/contracts/ProductCard";
import { TopicsDisplayer } from "./topics-displayer";
import { Image } from "@crystallize/reactjs-components";

export const ProductCard = ({ product }: { product: ProductType }) => {
    const priceVariant = {
        price: product?.price,
        currency: "USD",
    };
    const image = product?.image;
    return (
        <a
            href={product?.path}
            className="flex overflow-hidden lg:bg-[#d6e2e9] rounded-xl lg:h-96 p-5 lg:w-75 bg-background2 w-full"
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <TopicsDisplayer topics={product?.topics} />
                    <p className="self-end">
                        {priceVariant?.currency === "USD"
                            ? "$"
                            : priceVariant?.currency}
                        {priceVariant?.price}
                    </p>
                </div>
                <div className="flex justify-center box-border overflow-hidden w-full h-56 rounded-xl">
                    <Image
                        {...image}
                        sizes="(max-width: 700px) 200px, 300px"
                        loading="lazy"
                        className="mx-auto"
                    />
                </div>
                <h2 className="text-xl font-bold text-center mx-auto max-w-54 truncate">
                    {product?.name}
                </h2>
            </div>
        </a>
    );
};
