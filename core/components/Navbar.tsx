"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/core/auth/AuthContext";
import { logoutAction } from "@/core/auth/authActions";

export default function Navbar() {
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
      console.warn("[Navbar] logout error:", err);
      setLoggingOut(false);
    }
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-gray-900 text-sm">
          Workspace
        </Link>

        <nav className="flex items-center gap-6">
          {user?.modules.includes("invoice") && (
            <Link
              href="/modules/invoice"
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              Invoice
            </Link>
          )}
          {user?.modules.includes("school_fee") && (
            <Link
              href="/modules/school-fee"
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              School Fee
            </Link>
          )}

          <span className="text-xs text-gray-400">{user?.name || user?.email}</span>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-red-500 hover:text-red-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </nav>
      </div>
    </header>
  );
}
