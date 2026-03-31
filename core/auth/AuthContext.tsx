'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface AuthUser {
  name: string
  email: string
  modules: string[]
  token: string
}

interface AuthContextValue {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * AuthProvider is mounted in (protected)/layout.tsx with the user
 * already hydrated server-side from cookies. All client components
 * inside the protected layout can call useAuth() freely.
 */
export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: AuthUser | null
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
