/**
 * Invoice module — public API surface.
 *
 * Rule: nothing outside the /modules/invoice/ folder should import
 * from inside it except through this index file.
 * This keeps the module encapsulated and easy to extract later.
 *
 * Phase 1: shell placeholder.
 * Phase 2: import from ./components/InvoiceList, ./hooks/useInvoices, etc.
 */
export default function InvoiceApp() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
          invoice
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">Invoice</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage invoices and track payments
        </p>
      </div>

      {/* Placeholder content */}
      <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center">
        <p className="text-gray-400 text-sm font-medium">
          Invoice features — Phase 2
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Components will be added inside{' '}
          <code className="font-mono">modules/invoice/components/</code>
        </p>
      </div>
    </div>
  )
}
