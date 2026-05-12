import React, { useEffect, useState } from 'react'
import { authApi } from '@/api/client'
import type { SuperAdminUser } from '@/api/types'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<SuperAdminUser | null>(null)
  // Lazy initial state: only "loading" if there is actually a token to validate.
  // Avoids needing setLoading(false) synchronously inside the effect below
  // (react-hooks/set-state-in-effect rule).
  const [isLoading, setLoading] = useState(() => !!localStorage.getItem('platform_token'))

  useEffect(() => {
    const token = localStorage.getItem('platform_token')
    if (!token) return
    let cancelled = false
    authApi
      .getUser()
      .then((r) => {
        if (!cancelled) setAdmin(r.data)
      })
      .catch(() => {
        if (!cancelled) localStorage.removeItem('platform_token')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    const { token, user } = res.data
    localStorage.setItem('platform_token', token)
    setAdmin(user)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.warn('Logout request failed; clearing local session anyway.', err)
    }
    localStorage.removeItem('platform_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
