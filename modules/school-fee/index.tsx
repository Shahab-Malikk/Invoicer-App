/**
 * School Fee module — public API surface.
 * Same isolation rules as the invoice module.
 */
export default function SchoolFeeApp() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
          school_fee
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">School Fee</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track student fee records and payment history
        </p>
      </div>

      <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center">
        <p className="text-gray-400 text-sm font-medium">
          School Fee features — Phase 2
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Components will be added inside{' '}
          <code className="font-mono">modules/school-fee/components/</code>
        </p>
      </div>
    </div>
  )
}
