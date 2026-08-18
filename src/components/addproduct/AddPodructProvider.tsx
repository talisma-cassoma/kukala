import * as React from "react"
import { getSupabaseClient } from "@/lib/supabase"
import type { ProductBodyType } from "@/use-cases/contracts/ProductContent";
import type { Product as ProductType } from "@/use-cases/contracts/Product";
import Data from './data.json';

interface ProductContextValue {
  product: ProductBodyType & ProductType 
  setProduct: React.Dispatch<React.SetStateAction<ProductBodyType & ProductType>>
  loading: boolean
  error: string | null
}

const ProductContext = React.createContext<ProductContextValue | null>(null)

export function ProductProvider({ children }: { children: React.ReactNode }) {

  const [product, setProduct] = React.useState<ProductBodyType & ProductType >(Data)

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)


  const value = React.useMemo(
    () => ({
      product,
      loading,
      error,
      setProduct,
    }),
    [product, loading, error, setProduct]
  )

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = React.useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}