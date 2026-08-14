import { useState } from "react";
import { useStore } from '@nanostores/react';
import { ProductBody } from "./product-body";
import { productOptions, VariantSelector, type SelectedOptions } from "./variant-selector";
import { RelatedProducts } from "./related-products";
import type { ProductBodyType } from "@/use-cases/contracts/ProductContent";
import type { Product as ProductType } from "@/use-cases/contracts/Product";
import { addItemToCart, cart, type CartItem } from '@/pages/shop/cartStore';

export const ProductView = ({ product }: { product: ProductBodyType & ProductType }) => {
    const [selectedVariant, setSelectedVariant] = useState(product);
    const [selectedOptions, setSelectedOptions] =
        useState<SelectedOptions>({
            fragrance: "lavender",
            "bag-size": "small",
            delivery: "normal",
            gift: "none",
            eco: "no",
        });

    const defaultPrice = product.price ?? 0;
    const $cart = useStore(cart);
    const [buttonText, setButtonText] = useState("Add to Cart");

    const handleAddToCart = () => {
        setButtonText("Adding...");

        const cartItem: CartItem = {
            productId: product.id,
            sku: product.name,
            name: product.name,
            price: selectedVariant?.price ?? product.price ?? 0,
            quantity: 1,
            imageUrl: product.image?.url
        };
        addItemToCart(cartItem);
        setButtonText("Added 🎉");
        setTimeout(() => setButtonText("Add to Cart"), 1000);
    };

    return (
        <>
            <div className="flex lg:flex-row gap-6 w-full items-center flex-col my-8">
                <div className="flex flex-col text-text w-full lg:w-1/3">
                    <h1 className="font-extrabold text-4xl lg:text-5xl mb-3">
                        {product.name}
                    </h1>
                    {product?.summary && (
                        <p className="text-gray-700 leading-relaxed">
                            {product.summary}
                        </p>
                    )}
                </div>
                
                <figure className="rounded-xl overflow-hidden mx-auto max-w-sm flex justify-center items-center">
                    {product.image?.url && (
                        <img
                            src={product.image.url}
                            alt={product.image?.altText || product.name}
                            loading="lazy"
                            className="w-80 h-auto max-h-80 object-contain"
                        />
                    )}
                </figure>

                <div className="lg:mb-0 mb-5 w-full lg:w-auto">
                    <VariantSelector
                        groups={productOptions}
                        selected={selectedOptions}
                        onChange={(groupId, option) => {
                            setSelectedOptions((prev) => ({
                                ...prev,
                                [groupId]: option.id,
                            }));
                        }}
                    />
                </div>
            </div>

            <div className="flex z-10 justify-between items-center lg:w-5/12 w-11/12 mx-auto bg-white p-5 text-text rounded-xl border border-gray-200 shadow-sm my-6">
                <div>
                    <p className="font-semibold text-sm text-gray-500">Total price</p>
                    <p className="font-bold text-2xl text-text">
                        {defaultPrice} DH
                    </p>
                </div>
                <button
                    className="bg-[#c5dedd] hover:bg-[#b0d2d1] px-6 py-3 rounded-xl font-bold text-text transition-colors cursor-pointer"
                    onClick={handleAddToCart}
                >
                    {buttonText}
                </button>
            </div>

            <ProductBody body={product.body} table={product.table} />

            <div className="w-full my-12">
                <p className="text-text text-2xl font-bold mb-4">Related Products</p>
                <RelatedProducts />
            </div>
        </>
    );
};
