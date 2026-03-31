"use client";
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
  const { user } = useAuth();

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
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-red-500 hover:text-red-400 transition"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
