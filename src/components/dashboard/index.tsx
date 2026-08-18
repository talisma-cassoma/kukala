import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dashboard } from "./Dashboard";
import { LoginDialog } from "@/components/login";
import { getSupabaseClient } from "@/lib/supabase";
import { DashboardProvider } from "@/components/dashboard-provider";
import "@/styles/global.css";

export function DashboardRoot() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {

      // console.log("session: ", session)
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <TooltipProvider>
      {isAuthenticated ?
        <DashboardProvider>
          <Dashboard onAuthFailure={() => setIsAuthenticated(isAuthenticated)} />
        </DashboardProvider> :
        <div className="flex items-center justify-center h-screen"><LoginDialog /></div>}
    </TooltipProvider>
  );
}