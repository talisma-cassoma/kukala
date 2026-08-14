//import { imageMap } from "@/mock/image-map";

import type {
    ProductPriceVariant, // This type is from Crystallize and will be removed
    ProductVariant, // This type is from Crystallize and will be removed
} from "@crystallize/js-api-client"; 

// Assuming these contracts are also Crystallize-specific and will be replaced or are no longer needed here.
// If they are still needed, their definitions should be updated to reflect your Prisma schema.
import type { ProductBodyType } from "@/use-cases/contracts/ProductContent"; 
import type { Product as ProductType } from "@/use-cases/contracts/Product"; 


export function isEqual(a: any, b: any): boolean {
    // Handle primitive types and references to the same object
    if (a === b) {
        return true;
    }

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }

    // Handle objects
    if (typeof a === "object" && typeof b === "object") {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (!isEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }

    // Handle other types
    return false;
}

export const getComponentContentById = (arr: any[], id: string) => {
    return arr.find((item) => item.id === id)?.content;
};

export const getCurrencySymbol = (code: string, price: number) => {
    const symbol = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
    });
    return symbol.format(price);
};

// This function was specific to Crystallize's ProductPriceVariant structure.
// It is being removed as Crystallize is no longer used.
// If you have a similar concept of default price variants in your Prisma schema,
// you would implement a new function here based on your new data structure.
// export const getDefaultPriceVariant = (variants?: ProductPriceVariant[]) => {
//     return variants?.find((variant) => variant.identifier === "default");
// };

// Define a type that reflects the necessary product data for cart conversion
// This should align with how your products are structured after fetching from your new backend (Prisma)
interface ProductForCartConversion {
    id: string;
    name: string;
    price: number; // Assuming a single price or a default variant price
    productId: string;
    sku: string;
    quantity: number;
    image?: string;
    attributes?: any;
}

export type variantToCartItemType = {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    attributes?: any;
}

export const variantToCartItem = (product: ProductForCartConversion) => {
    return {
        productId: product.id,
        sku: product.name, // Using product name as SKU for now, adjust if you have a specific SKU field
        name: product.name,
        quantity: 1,
        price: product.price,
        image: product.image,
        attributes: product.attributes,
    } as variantToCartItemType;
};

// export function resolveImage(cell: any) {
//   const key = cell?.item?.path?.split("/").pop();

//   const mapped = imageMap[key];

//   if (!mapped) return cell;

//   return {
//     ...cell,
//     item: {
//       ...cell.item,
//       variants: [
//         {
//           ...cell.item.variants[0],
//           images: [
//             {
//               ...cell.item.variants[0].images[0],
//               url: mapped.src,
//             },
//           ],
//         },
//       ],
//     },
//   };
// }
