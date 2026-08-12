import { useState, useEffect } from "react";
import { Image } from "@crystallize/reactjs-components";
import { fetchFrontPage } from "../use-cases/queries/frontpage.ts";
import type { ProductType } from "@/use-cases/contracts/ProductCard.js";

export const RelatedProducts = () => {
    const [catalog, setCatalog] = useState<{
        retailProducts: ProductType[];
        comboboxes: ProductType[];
        discountedBundles: ProductType[];
    } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            // Astro.url.origin is not available in client-side React components.
            // We can use window.location.origin instead.
            const data = await fetchFrontPage(window.location.origin);
            setCatalog(data);
        };

        loadData();
    }, []);

    if (!catalog) {
        return <div>Loading related products...</div>;
    }

    const allProducts = catalog.retailProducts;

    return (
        <div className="flex flex-row justify-around w-full max-w-100 h-fit items-start gap-2">
            {allProducts.map((item, index: number) => (
                <a
                    href={item.path}
                    key={index}
                    className="bg-primary px-4 py-3 rounded-xl border-2 border-grey  flex flex-col"
                >
                    <div className="flex justify-between">
                        <div className="flex gap-1">
                            {item.topics?.map((topic: { name: string }) => (
                                <div
                                    className="text-sm bg-grey px-2 py-1 rounded-2xl"
                                    key={topic.name}
                                >
                                    {topic.name}
                                </div>
                            ))}
                        </div>
                        <div>${item.price}</div>
                    </div>
                    <div className="flex justify-center items-center h-64 w-56 rounded-xl overflow-hidden box-border"> 
                    <img
                        src={item.image?.url}
                        alt={item.image?.altText}
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                    </div>
                        
                    <h2 className="text-l text-center m-auto self-end truncate">
                        {item.name}
                    </h2>
                </a>
            ))}
        </div>
    );
};
