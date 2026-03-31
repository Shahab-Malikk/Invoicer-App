'use client'
import { useAuth } from '@/core/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  moduleKey: string
  children: React.ReactNode
}

/**
 * Wraps any module page. If the authenticated user's modules[] does NOT
 * include moduleKey, they are immediately pushed to /dashboard.
 *
 * This is Layer 3 of the security model — the client-side guard.
 * Backend [Authorize] is still Layer 4 for actual data calls.
 */
export default function ModuleGuard({ moduleKey, children }: Props) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !user.modules.includes(moduleKey)) {
      router.replace('/dashboard')
    }
  }, [user, moduleKey, router])

  // While redirecting, render nothing — prevents a flash of the module UI
  if (!user || !user.modules.includes(moduleKey)) return null

  return <>{children}</>
}
