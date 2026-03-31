"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";

export default function InvoiceSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/modules/invoice",
      icon: LayoutDashboard,
      isActive: pathname === "/modules/invoice",
    },
    {
      label: "Invoices",
      href: "/modules/invoice/invoices",
      icon: FileText,
      isActive: pathname.startsWith("/modules/invoice/invoices"),
    },
    {
      label: "Customers",
      href: "/modules/invoice/customers",
      icon: Users,
      isActive: pathname.startsWith("/modules/invoice/customers"),
    },
    {
      label: "Settings",
      href: "/modules/invoice/settings",
      icon: Settings,
      isActive: pathname.startsWith("/modules/invoice/settings"),
    },
  ];

  return (
    <aside
      className="w-60 fixed left-0 top-20 min-h-[calc(100vh-80px)] flex flex-col border-r border-gray-800 overflow-y-auto"
      style={{ backgroundColor: "#0f1117" }}
    >
      {/* Logo / Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">
              Invoicing App
            </span>
          </div>
          <button
            className="text-gray-400 hover:text-white transition"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4 px-3">
          Navigation
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition ${
                  item.isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer (optional) */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">Invoice Module v1.0</p>
      </div>
    </aside>
  );
}
