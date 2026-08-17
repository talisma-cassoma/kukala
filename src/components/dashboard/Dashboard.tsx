import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getSupabaseClient } from "@/lib/supabase";
import "@/styles/global.css";

export function Dashboard({ onAuthFailure }: { onAuthFailure: () => void }) {
  const [dashboardData, setDashboardData] = useState<{ recentOrders: any[], statistics: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onAuthFailure();
    window.location.href = '/admin/dashboard'; // Redirect to login
  };

  const fetchData = useCallback(async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      onAuthFailure();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/orders/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });


      if (response.status === 401 || response.status === 403) {
        onAuthFailure();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }
      const data = await response.json();
      //console.log("auth data: ",data)


      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
      console.error("error: ", err);
    } finally {
      setLoading(false);
    }
  }, [onAuthFailure, supabase]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <header className="flex h-[var(--header-height)] shrink-0 items-center justify-between gap-2 border-b px-4 lg:px-6">
          <SiteHeader />
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {loading && <div className="p-4 text-center">Loading dashboard...</div>}
            {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
            {dashboardData && (
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards statistics={dashboardData.statistics} />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={dashboardData.recentOrders} onUpdate={fetchData} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
