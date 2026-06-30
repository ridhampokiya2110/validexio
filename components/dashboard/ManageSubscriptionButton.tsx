"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lemonsqueezy/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open portal: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button aria-label="Button action" type="button"
      onClick={handleManage}
      disabled={loading}
      className="btn-secondary text-sm px-4 py-2 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      Manage Subscription
    </button>
  );
}
