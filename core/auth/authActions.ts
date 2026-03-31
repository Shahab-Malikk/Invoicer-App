'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:5000'

/**
 * loginAction — called from the login form.
 * On success:
 *   - Sets auth_token as httpOnly cookie (not readable by JS — XSS safe)
 *   - Sets user_info as a readable cookie (email + modules for client hydration)
 * On failure: returns { error: string }
 */
export async function loginAction(email: string, password: string) {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { error: 'Cannot reach the server. Please try again.' }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: err.message ?? 'Invalid email or password.' }
  }

  const data = await res.json()

  const cookieStore = await cookies()
  const maxAge = 60 * 60 // 1 hour — matches backend JWT expiry

  // httpOnly: true  →  JavaScript cannot read this. XSS cannot steal it.
  cookieStore.set('auth_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  })

  // httpOnly: false → readable by React context to hydrate without an extra API call.
  // Contains ONLY non-sensitive display data (email, module keys — no secrets).
  cookieStore.set(
    'user_info',
    JSON.stringify({ email: data.email, modules: data.modules }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/',
    }
  )

  return { success: true }
}

/**
 * logoutAction — clears both cookies and redirects to login.
 * Called from a <form action={logoutAction}> so it's a POST — CSRF safe.
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  cookieStore.delete('user_info')
  redirect(process.env.NEXT_PUBLIC_AUTH_UI_URL ?? 'http://localhost:4005/?app=kycv1')
}
