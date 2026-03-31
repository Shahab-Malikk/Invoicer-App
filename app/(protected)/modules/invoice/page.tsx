import ModuleGuard from "@/core/components/ModuleGuard";

/**
 * Invoice dashboard — shows overview of invoice data.
 * Phase 1: placeholder
 */
export default function InvoiceDashboardPage() {
  return (
    <ModuleGuard moduleKey="invoice">
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Invoice overview coming soon
        </p>
      </div>
    </ModuleGuard>
  );
}
