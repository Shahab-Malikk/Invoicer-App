"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/core/auth/AuthContext";
import { logoutAction } from "@/core/auth/authActions";

/**
 * Header for invoice module — shows workspace navigation and user info
 * Sits above the main content area, allowing users to:
 * - Return to dashboard/other modules
 * - See their email
 * - Sign out
 */
export default function InvoiceHeader() {
  const { user, setUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const { authUiUrl } = await logoutAction();
      setUser(null);
      window.location.replace(authUiUrl);
    } catch (err) {
      console.warn("[InvoiceHeader] logout error:", err);
      setLoggingOut(false);
    }
  }

  return (
    <header
      className="border-b border-gray-700 px-8 py-4 flex items-center justify-between"
      style={{ backgroundColor: "#0f1117" }}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workspace
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{user?.email}</span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm text-red-500 hover:text-red-400 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
