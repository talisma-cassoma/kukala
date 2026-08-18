import * as React from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { type z } from "zod"
import { type schema } from "@/components/table-cell-viewer"

export type DashboardOrder = z.infer<typeof schema>

interface DashboardContextValue {
  orders: DashboardOrder[]
  setOrders: React.Dispatch<React.SetStateAction<DashboardOrder[]>>
  statistics: any | null
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = React.useState<DashboardOrder[]>([])
  const [statistics, setStatistics]= React.useState<any | null>(null);

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchOrders = React.useCallback(async () => {
    setLoading(true)
    setError(null)
       try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      const response = await fetch("/api/orders/admin/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`)
      }

      const data = await response.json()

      setOrders(data.recentOrders)
      setStatistics(data.statistics)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const value = React.useMemo(
    () => ({
      orders,
      loading,
      error,
      fetchOrders,
      setOrders,
      statistics,
    }),
    [orders, loading, error, fetchOrders, setOrders, statistics]
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = React.useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}