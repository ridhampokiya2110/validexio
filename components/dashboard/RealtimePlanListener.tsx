"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RealtimePlanListener({ userId }: { userId?: string }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !userId) return;

    // Temporarily disabled to prevent "channel error: transport failure" from showing up in local dev
    /*
    const channel = supabase.channel(`user-updates:${userId}`);

    try {
      channel
        .on("broadcast", { event: "plan-updated" }, (payload) => {
          // Trigger a persistent toast notification with a refresh action
          toast("Plan Updated by Admin", {
            description: "Your plan or credits have been manually updated. Please refresh the page to apply changes.",
            icon: <RefreshCw className="w-5 h-5 text-cherry animate-spin" />,
            duration: Infinity, // Stay until dismissed or clicked
            action: {
              label: "Refresh Now",
              onClick: () => router.refresh(),
            },
            cancel: {
              label: "Dismiss",
              onClick: () => console.log("Dismissed"),
            },
          });
        })
        .subscribe((status, err) => {
          if (err) {
            console.error("Supabase Realtime subscription error:", err);
          }
          if (status === "SUBSCRIBED") {
            console.log(`Subscribed to realtime updates for user ${userId}`);
          }
        });
    } catch (err) {
      console.error("Failed to connect to Supabase Realtime:", err);
    }
    */
  }, [mounted, userId, router]);

  return null; // This component is invisible
}
