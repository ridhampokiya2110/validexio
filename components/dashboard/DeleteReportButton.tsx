"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteReportButton({ reportId }: { reportId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);

      // Optimistic UI Update: Instantly hide the parent card
      const card = (e.currentTarget as HTMLElement).closest('.glass-card') as HTMLElement;
      if (card) {
        card.style.display = 'none';
      }

      const res = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete report");
      }

      toast.success("Report deleted successfully");
      window.location.href = "/dashboard/reports";
    } catch (error) {
      // Revert the optimistic update if it fails
      const card = (e.currentTarget as HTMLElement).closest('.glass-card') as HTMLElement;
      if (card) {
        card.style.display = '';
      }
      toast.error("Failed to delete report");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button aria-label="Button action" type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg hover:bg-red-50 text-[#1B1716]/30 hover:text-red-500 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      title="Delete Report"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
