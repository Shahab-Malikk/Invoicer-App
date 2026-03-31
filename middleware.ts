import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge Middleware — Layer 1 of route protection.
 *
 * Runs on the CDN edge BEFORE any page or API route handler executes.
 * This is the fastest possible check — no database, no React, no server.
 *
 * Rules:
 *   - Unauthenticated users hitting a protected path → /login
 *   - Authenticated users hitting /login → /dashboard (avoid login flash)
 *
 * Note: Middleware only checks cookie PRESENCE, not signature validity.
 * The server layout (Layer 2) and backend [Authorize] (Layer 4) handle
 * full cryptographic validation.
 */

const PUBLIC_PATHS = ['/login', '/auth', '/api/auth']

const AUTH_UI_URL = process.env.NEXT_PUBLIC_AUTH_UI_URL ?? 'http://localhost:4005/?app=kycv1'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const isStaticAsset = pathname.startsWith('/_next') || pathname === '/favicon.ico'

  if (isStaticAsset) return NextResponse.next()

  // No token + protected path → redirect to external login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL(AUTH_UI_URL))
  }

  // Has token + hitting login → already authenticated, go to dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
