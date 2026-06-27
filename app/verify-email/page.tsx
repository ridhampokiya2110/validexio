import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";
import { Loader2 } from "lucide-react";

export const metadata = { title: "Verify Email" };

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-[#FDFCF8]">
      <div className="hero-orb-1 top-0 right-0 opacity-20"></div>
      <div className="hero-orb-2 bottom-0 left-0 opacity-20 bg-cherry"></div>

      <div className="glass-card w-full max-w-md p-8 text-center relative z-10 animate-fade-in-scale">
        <Suspense fallback={<Loader2 className="w-8 h-8 text-cherry animate-spin mx-auto" />}>
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  );
}
