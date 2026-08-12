//import { imageMap } from "@/mock/image-map";

import type {
    ProductPriceVariant,
    ProductVariant,
} from "@crystallize/js-api-client";
import type { ProductBodyType } from "../use-cases/contracts/ProductContent";
import type { Product as ProductType } from "../use-cases/contracts/Product";

import fs from 'fs/promises';


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

export const getDefaultPriceVariant = (variants?: ProductPriceVariant[]) => {
    return variants?.find((variant) => variant.identifier === "default");
};

export type variantToCartItemType={
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    attributes?: any;
}

export const variantToCartItem = (variant: ProductBodyType & ProductType) => {
    //const defaultPrice = getDefaultPriceVariant(variant.priceVariants || []);
    return {
        productId: variant.id,
        sku: variant.name,
        name: variant.name,
        quantity: 1,
        price: variant.price,
        image: variant.image.url,
        attributes: variant.productOptions,
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



//importar dados do JSON
async function importJSON() {
  try {
    const data = await fs.readFile("./src/mock/response.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao importar JSON:", err);
    return null;
  }
}
//salvar JSON
// async function saveJSON(data: any) {
//   try {
//     await fs.writeFile(
//       "./response.json",
//       JSON.stringify(data, null, 2),
//       "utf-8"
//     );

//     console.log("JSON salvo com sucesso!");
//   } catch (err) {
//     console.error("Erro ao salvar JSON:", err);
//   }
// }

// await saveJSON(data);
