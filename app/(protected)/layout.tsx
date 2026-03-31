import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthProvider } from '@/core/auth/AuthContext'
import Navbar from '@/core/components/Navbar'

/**
 * Layer 2: Server layout guard.
 *
 * Runs on every render of a (protected) page.
 * - Reads cookies server-side (zero latency, no client JS required)
 * - Redirects if token or user_info is missing
 * - Hydrates AuthContext so all child client components get user data instantly
 *   without a useEffect round-trip
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const userInfoRaw = cookieStore.get('user_info')?.value

  if (!token || !userInfoRaw) {
    redirect('/login')
  }

  let userInfo: { name: string; email: string; modules: string[] }
  try {
    userInfo = JSON.parse(userInfoRaw)
  } catch {
    redirect('/login') // corrupt cookie
  }

  const initialUser = {
    name: userInfo.name ?? '',
    email: userInfo.email,
    modules: userInfo.modules,
    token,
  }

  return (
    <AuthProvider initialUser={initialUser}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </div>
    </AuthProvider>
  )
}
