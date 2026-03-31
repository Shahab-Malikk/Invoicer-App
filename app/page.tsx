import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Root page: immediately redirect based on auth state.
 * Middleware handles the edge-level redirect; this is the server fallback.
 */
export default async function RootPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  redirect(token ? '/dashboard' : '/login')
}
