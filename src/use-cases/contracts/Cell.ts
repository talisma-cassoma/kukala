import type { ProductType } from "@/use-cases/contracts/ProductCard"

export type ProductsType = {
    comboboxes: ProductType[],
    discountedBundles: ProductType[]
    retailProducts: ProductType[]
}

