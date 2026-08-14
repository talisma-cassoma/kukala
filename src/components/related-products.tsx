import { useState, useEffect } from "react";
import type { ProductType } from "@/use-cases/contracts/ProductCard";

export const RelatedProducts = () => {
    const [catalog, setCatalog] = useState<{
        retailProducts: ProductType[];
        comboboxes: ProductType[];
        discountedBundles: ProductType[];
    } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            // Fetch data from the API endpoint instead of direct import
            const response = await fetch('/api/frontpage');
            if (!response.ok) return;
            const data = await response.json();
            setCatalog(data);
        };

        loadData();
    }, []);

    if (!catalog || !catalog.retailProducts || catalog.retailProducts.length === 0) {
        return null;
    }

    const allProducts = catalog.retailProducts;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-190 my-6">
            {allProducts.map((item, index: number) => (
                <a
                    href={item.path}
                    key={item.id || index}
                    className="bg-[#d6e2e9] p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-wrap gap-1">
                            {item.topics?.map((topic: { name: string }) => (
                                <div
                                    className="text-xs bg-white/70 px-2 py-1 rounded-full text-text"
                                    key={topic.name}
                                >
                                    {topic.name}
                                </div>
                            ))}
                        </div>
                        <div className="font-bold text-text">${item.price}</div>
                    </div>
                    <div className="flex justify-center items-center h-48 w-full rounded-xl overflow-hidden my-2"> 
                        {item.image?.url && (
                            <img
                                src={item.image.url}
                                alt={item.image.altText || item.name}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                            />
                        )}
                    </div>
                        
                    <h2 className="text-sm font-semibold text-center mt-2 truncate text-text">
                        {item.name}
                    </h2>
                </a>
            ))}
        </div>
    );
};
