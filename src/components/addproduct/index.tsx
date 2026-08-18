import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {ProductDashboardRoot} from "@/components/addproduct/AddProduct"
import { LoginDialog } from "@/components/login";
import { getSupabaseClient } from "@/lib/supabase";
import { ProductProvider } from "@/components/addproduct/AddPodructProvider";
import "@/styles/global.css";

export function PoductDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

console.log("productDashboard")

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
      <ProductProvider>
          <ProductDashboardRoot onAuthFailure={() => setIsAuthenticated(isAuthenticated)} /> 
      </ProductProvider>
          :
        <div className="flex items-center justify-center h-screen"><LoginDialog /></div>}
    </TooltipProvider>
  );
}