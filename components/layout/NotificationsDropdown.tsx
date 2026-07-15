"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, FileText, LogIn, AlertTriangle, Shield, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  link: string;
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/activity");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
        setHasUnread(data.activities?.length > 0);
      }
    } catch (error) {
      console.error("Error fetching activities", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/v1/activity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setActivities(prev => prev.filter(a => a.id !== id));
      setHasUnread(activities.length > 1);
    } catch (error) {
      console.error("Failed to mark read", error);
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchActivities();
    }
    setIsOpen(!isOpen);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PLAN_BOUGHT": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "SECURITY_UPGRADE": return <Shield className="w-4 h-4 text-blue-500" />;
      case "AFFILIATE_CODE": return <FileText className="w-4 h-4 text-purple-500" />;
      case "AFFILIATE_SALE": return <LogIn className="w-4 h-4 text-emerald-500" />;
      case "PAYOUT": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "SUPPORT": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-[#1B1716]/60" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button aria-label="Button action" type="button" 
        onClick={toggleDropdown}
        className={`relative p-2 rounded-lg hover:bg-[#1B1716]/10 transition-colors ${isOpen ? 'bg-[#1B1716]/10 text-[#1B1716]' : 'text-[#1B1716]/60 hover:text-[#1B1716]'}`}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cherry rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay to capture clicks outside */}
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          <div className="absolute right-[-10px] sm:right-0 top-full mt-2 w-[320px] sm:w-96 bg-white rounded-xl shadow-2xl border border-[#1B1716]/10 z-[100] overflow-hidden animate-fade-in-scale">
            <div className="p-4 border-b border-[#1B1716]/10 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-[#1B1716]">Recent Notifications</h3>
            {activities.length > 0 && (
              <span className="text-xs bg-cherry/10 text-cherry px-2 py-1 rounded-full font-semibold">
                {activities.length} New
              </span>
            )}
          </div>
          
          <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="w-6 h-6 text-cherry animate-spin" />
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-[#1B1716]/50 text-sm flex flex-col items-center">
                <Bell className="w-8 h-8 text-[#1B1716]/20 mb-2" />
                You're all caught up!
              </div>
            ) : (
              <div className="divide-y divide-[#1B1716]/5">
                {activities.map((activity) => (
                  <Link aria-label="Navigation link" 
                    key={activity.id} 
                    href={activity.link}
                    onClick={() => markAsRead(activity.id)}
                    className="flex gap-3 p-4 hover:bg-[#1B1716]/5 transition-colors items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1B1716]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1B1716] leading-snug mb-0.5">
                        {activity.title}
                      </p>
                      <p className="text-xs text-[#1B1716]/60 line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-[10px] text-[#1B1716]/40 mt-1.5 font-medium">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-[#1B1716]/10 bg-gray-50 text-center">
            <Link aria-label="Navigation link" 
              href="/dashboard/security" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-cherry hover:text-cherry/80 transition-colors"
            >
              Security Settings
            </Link>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
