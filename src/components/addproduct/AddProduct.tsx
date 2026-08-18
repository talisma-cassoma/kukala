import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/addproduct/side-bar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ProductView } from "@/components/product";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getSupabaseClient } from "@/lib/supabase";
import "@/styles/global.css";
import { useDashboard } from "@/components/dashboard-provider"
import { useProduct } from "./AddPodructProvider";

export function ProductDashboardRoot({ onAuthFailure }: { onAuthFailure: () => void }) {
  const { product } = useProduct();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onAuthFailure();
    window.location.href = '/admin/dashboard'; // Redirect to login
  };

  return (

    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
     <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-[var(--header-height)] shrink-0 items-center justify-between gap-2 border-b px-4 lg:px-6">
          <SiteHeader />
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4">
            {
              product ? (
                <ProductView product={product}/>
              ) : (
                <div className="py-20 text-center">
                  <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                  <a href="/" className="underline text-text">Return to shop</a>
                </div>
              )
            }
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
