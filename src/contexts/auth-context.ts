import { createContext } from 'react'
import type { SuperAdminUser } from '@/api/types'

export interface AuthContextValue {
  admin: SuperAdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
