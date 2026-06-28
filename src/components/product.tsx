import { useState, useEffect } from "react";
import { ContentTransformer, Image } from "@crystallize/reactjs-components";
import { ProductBody } from "./product-body";
import { VariantSelector } from "./variant-selector";
import { RelatedProducts } from "./related-products";
import {
    getCurrencySymbol,
    getDefaultPriceVariant,
    variantToCartItem,
} from "../use-cases/utils";
import type { Product as ProductType } from "../use-cases/contracts/Product";

export const relatedProducts = {
    "content": {
        "items": [
            {
                "id": "crystallize-spec-ref-61f004b959b0e119fc8c27d6",
                "__typename": "Product",
                "name": "Strawberry blast",
                "path": "/shop/strawberry-blast",
                "topics": [
                    {
                        "name": "limited-edition"
                    },
                    {
                        "name": "glazed"
                    }
                ],
                "bundle": {
                    "content": null
                },
                "defaultVariant": {
                    "firstImage": {
                        "url": "https://media.crystallize.com/dounot/23/10/1/2/strawberry_blast.png",
                        "altText": "Strawberry flavoured donut",
                        "variants": []
                    },
                    "priceVariant": {
                        "price": 6,
                        "currency": "USD"
                    }
                }
            },
            {
                "id": "crystallize-spec-ref-61f00d4059b0e119fc8c28aa",
                "__typename": "Product",
                "name": "Creamy Nonsense",
                "path": "/shop/creamy-nonsense",
                "topics": [
                    {
                        "name": "new"
                    },
                    {
                        "name": "glazed"
                    }
                ],
                "bundle": {
                    "content": null
                },
                "defaultVariant": {
                    "firstImage": {
                        "url": "https://media.crystallize.com/dounot/23/10/1/4/creamy_nonsense.png",
                        "altText": "Donut with vanilla frosting and chocolate drizzle.",
                        "variants": []
                    },
                    "priceVariant": {
                        "price": 8,
                        "currency": "USD"
                    }
                }
            }
        ]
    }
}

export const Product = ({ product }: { product: ProductType }) => {
    const [selectedVariant, setSelectedVariant] = useState(
        product?.variants?.[0]
    );
    
    const onVariantChange = (variant: any) => setSelectedVariant(variant);
    const defaultPrice = getDefaultPriceVariant(selectedVariant?.priceVariants);
    const [cart, setCart] = useState<any>([]);
    const [buttonText, setButtonText] = useState("Add to Cart");

    const addToCart = (product: any) => {
        setButtonText("Adding...");
        const newCart = [...cart, variantToCartItem(product)];
        setCart(newCart);
        setButtonText("Added 🎉");
        setTimeout(() => setButtonText("Add to Cart"), 1000);
    };

    useEffect(() => {
        const cart = localStorage.getItem("cart");
        if (cart) {
            setCart(JSON.parse(cart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <>
            <div className="flex lg:flex-row gap-2 w-full items-center flex-col">
                <div className="flex flex-col text-text w-[400px]">
                    <h1 className="font-extrabold text-5xl mb-3">
                        {product.name}
                    </h1>
                    <ContentTransformer
                        json={product?.summary?.content?.json as [any]}
                    />
                </div>
                <Image
                    {...product.defaultVariant?.firstImage}
                    sizes="500px"
                    className="rounded-sm mx-auto"
                />
                <div className="lg:mb-0 mb-5">
                    <VariantSelector
                        variants={product.variants!}
                        selectedVariant={selectedVariant!}
                        onVariantChange={onVariantChange}
                    />
                </div>
            </div>
            <div className="flex z-10 justify-between lg:w-5/12 w-8/12 mx-auto bg-white p-5 text-text rounded-xl">
                <div>
                    <p className="font-semibold text-sm">Total price</p>
                    <p className="font-bold text-lg">
                        {getCurrencySymbol(
                            defaultPrice?.currency ?? "EUR",
                            defaultPrice?.price ?? 0.0
                        )}
                    </p>
                </div>
                <button
                    className="bg-background2 px-4 rounded-xl"
                    onClick={() => addToCart(selectedVariant)}
                >
                    {buttonText}
                </button>
            </div>
            <ProductBody body={product.body} table={product.table} />
            <p className="text-text mb-4 font-semibold">Related do(u)nuts</p>
            <RelatedProducts related={relatedProducts as any} />
        </>
    );
};
