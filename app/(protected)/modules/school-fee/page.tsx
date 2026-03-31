import ModuleGuard from '@/core/components/ModuleGuard'
import SchoolFeeApp from '@/modules/school-fee'

export default function SchoolFeePage() {
  return (
    <ModuleGuard moduleKey="school_fee">
      <SchoolFeeApp />
    </ModuleGuard>
  )
}
