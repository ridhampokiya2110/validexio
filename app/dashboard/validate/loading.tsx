import { Loader2 } from "lucide-react";

export default function ValidateLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-cherry animate-spin mb-4" />
      <h2 className="text-lg font-bold text-[#1B1716]">Loading Workspace...</h2>
      <p className="text-[#1B1716]/50 text-sm">Preparing your validation environment.</p>
    </div>
  );
}
