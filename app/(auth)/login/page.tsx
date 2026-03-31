import { redirect } from 'next/navigation'

/**
 * /login is kept as a fallback redirect target (e.g. from ProtectedLayout).
 * The primary unauthenticated redirect is handled in middleware.ts.
 */
export default function LoginPage() {
  redirect(process.env.NEXT_PUBLIC_AUTH_UI_URL ?? 'http://localhost:4005/?app=kycv1')
}
