import InvoiceSidebar from "@/modules/invoice/components/InvoiceSidebar";
import InvoiceHeader from "@/modules/invoice/components/InvoiceHeader";

/**
 * Invoice module layout — applies to all routes under /modules/invoice/
 *
 * Uses absolute positioning to break out of the protected layout's
 * constrained main element. Provides a dark-themed full-screen layout with:
 * - Header: workspace navigation + user info
 * - Sidebar: module internal navigation
 * - Main content: page content
 */
export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#1a1d23" }}
    >
      <InvoiceHeader />
      <div className="flex flex-1 overflow-hidden">
        <InvoiceSidebar />
        <main className="flex-1 overflow-auto ml-60">{children}</main>
      </div>
    </div>
  );
}
