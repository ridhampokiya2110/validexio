"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, Check, X, ShieldAlert } from "lucide-react";

type ConsentStatus = "accepted" | "declined" | "undecided";

interface CookieConsentContextType {
  consent: ConsentStatus;
  isLoaded: boolean;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>("undecided");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem("validexio_cookie_consent") as ConsentStatus | null;
      if (storedConsent === "accepted" || storedConsent === "declined") {
        setConsent(storedConsent);
      } else {
        setConsent("undecided");
      }
    } catch (e) {
      console.warn("localStorage is not available:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const acceptCookies = () => {
    setConsent("accepted");
    try {
      localStorage.setItem("validexio_cookie_consent", "accepted");
    } catch (e) {
      console.error(e);
    }
  };

  const declineCookies = () => {
    setConsent("declined");
    try {
      localStorage.setItem("validexio_cookie_consent", "declined");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CookieConsentContext.Provider value={{ consent, isLoaded, acceptCookies, declineCookies }}>
      {children}
      <CookieBanner />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}

// ─── COOKIE BANNER (Floating at bottom of all pages) ───
function CookieBanner() {
  const { consent, isLoaded, acceptCookies, declineCookies } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && consent === "undecided") {
      // Delay showing banner slightly for smooth animation feel
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [consent, isLoaded]);

  if (!isLoaded || consent !== "undecided" || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
      <div className="bg-[#FDFCF8] border border-[#1B1716]/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-cherry/10 rounded-xl flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-cherry animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-[#1B1716] tracking-tight leading-tight mb-1">
              Cookie Consent Preference
            </h3>
            <p className="text-xs text-[#1B1716]/60 leading-relaxed font-medium">
              We use essential cookies to run our Data Engine validation, secure checkout, and analyze platform telemetry. By accepting, you agree to our{" "}
              <Link href="/legal" className="text-cherry hover:underline font-bold">
                Privacy Policy
              </Link>.
            </p>
          </div>
          <button 
            onClick={declineCookies} 
            className="text-[#1B1716]/40 hover:text-[#1B1716] transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-4">
          <button
            onClick={declineCookies}
            className="px-3.5 py-1.5 border border-[#1B1716]/15 hover:bg-[#1B1716]/5 text-[#1B1716]/70 hover:text-[#1B1716] text-[11px] font-bold rounded-lg transition-all"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-1.5 bg-cherry hover:bg-[#8d0910] text-[#EDEBDE] text-[11px] font-bold rounded-lg transition-all shadow-md shadow-cherry/10"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COOKIE REQUIRED INTERCEPT MODAL ───
export function CookieConsentModal({ 
  isOpen, 
  onClose,
  onAccept
}: { 
  isOpen: boolean; 
  onClose?: () => void;
  onAccept?: () => void;
}) {
  const { acceptCookies } = useCookieConsent();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1B1716]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#FDFCF8] border border-[#1B1716]/10 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-cherry/10 rounded-2xl flex items-center justify-center mb-5">
            <ShieldAlert className="w-7 h-7 text-cherry animate-bounce" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-[#1B1716] tracking-tight leading-tight mb-3">
            Cookies Consent Required
          </h3>

          <p className="text-sm text-[#1B1716]/65 leading-relaxed font-medium mb-6">
            To ensure complete legal compliance and validate your startup ideas safely, we require cookies to be enabled. Without this, the Data Engine algorithms and lead generators cannot run.
          </p>

          <div className="w-full space-y-2.5">
            <button
              onClick={() => {
                acceptCookies();
                if (onAccept) onAccept();
              }}
              className="w-full py-3.5 bg-cherry hover:bg-[#8d0910] text-[#EDEBDE] text-sm font-bold rounded-xl transition-all shadow-lg shadow-cherry/20 active:scale-[0.98]"
            >
              Accept Cookies & Continue
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#1B1716]/15 hover:bg-[#1B1716]/5 text-[#1B1716]/60 hover:text-[#1B1716] text-sm font-bold rounded-xl transition-all"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
