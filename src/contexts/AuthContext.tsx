import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '@/api/client'

interface SuperAdmin {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  admin: SuperAdmin | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin]       = useState<SuperAdmin | null>(null)
  const [isLoading, setLoading] = useState(true)

  // Restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('platform_token')
    if (!token) { setLoading(false); return }

    authApi.getUser()
      .then((r) => setAdmin(r.data))
      .catch(() => localStorage.removeItem('platform_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    const { token, user } = res.data
    localStorage.setItem('platform_token', token)
    setAdmin(user)
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('platform_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
