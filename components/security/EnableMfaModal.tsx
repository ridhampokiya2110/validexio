"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EnableMfaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSent(true);
      } else {
        toast.error(data.error || "Failed to send 2FA code");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Unexpected error");
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBackupCodes(data.backupCodes);
        toast.success("2FA successfully enabled!");
        router.refresh(); // Refresh server state
      } else {
        toast.error(data.error || "Invalid code");
      }
    } catch (error) {
      toast.error("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button aria-label="Button action" type="button"
        onClick={handleOpen}
        className="mt-2 text-xs font-semibold text-white bg-cherry/90 hover:bg-cherry px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
      >
        Enable MFA
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button aria-label="Button action" type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {backupCodes ? (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Save your backup codes</h3>
                <p className="text-sm text-gray-500 mb-6">
                  If you lose access to your email, you can use these backup codes to sign in.
                  Save them in a safe place.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-2 gap-3 text-sm font-mono text-gray-800 mb-6">
                  {backupCodes.map((bc, i) => (
                    <div key={`item-${i}`}>{bc}</div>
                  ))}
                </div>
                <button aria-label="Button action" type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-cherry text-white py-2.5 rounded-xl font-medium hover:bg-cherry/90 transition-colors"
                >
                  I've saved them
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-6">
                  We will send a 6-digit security code to your email every time you log in.
                </p>

                {isLoading && !emailSent ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-cherry animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="bg-green-50 text-green-700 text-sm font-medium py-2 px-4 rounded-lg mb-6 border border-green-100">
                      Code sent! Please check your email inbox.
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cherry/50 focus:border-cherry transition-all"
                      />
                      <button aria-label="Button action" type="button"
                        onClick={handleVerify}
                        disabled={code.length !== 6 || isLoading}
                        className="w-full bg-cherry text-white py-2.5 rounded-xl font-medium hover:bg-cherry/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Verify & Enable
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
