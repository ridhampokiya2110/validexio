"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { RefreshCw } from "lucide-react";

export function RealtimePlanListener({ userId }: { userId?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !userId) return;

    // Connect to a user-specific broadcast channel
    const channel = supabase.channel(`user-updates:${userId}`);

    channel
      .on("broadcast", { event: "plan-updated" }, (payload) => {
        // Trigger a persistent toast notification with a refresh action
        toast("Plan Updated by Admin", {
          description: "Your plan or credits have been manually updated. Please refresh the page to apply changes.",
          icon: <RefreshCw className="w-5 h-5 text-cherry animate-spin" />,
          duration: Infinity, // Stay until dismissed or clicked
          action: {
            label: "Refresh Now",
            onClick: () => window.location.reload(),
          },
          cancel: {
            label: "Dismiss",
            onClick: () => console.log("Dismissed"),
          },
        });
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Subscribed to realtime updates for user ${userId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mounted, userId]);

  return null; // This component is invisible
}
