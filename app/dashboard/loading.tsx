import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center w-full h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-cherry">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-medium text-[#1B1716]/60 animate-pulse">Loading section...</p>
      </div>
    </div>
  );
}
