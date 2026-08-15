import { TooltipProvider } from "@/components/ui/tooltip";
import { Dashboard } from "./Dashboard";

export function DashboardRoot() {
  return (
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  );
}