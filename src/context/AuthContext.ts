import { createContext } from 'react'
import type { User } from '@/types/auth'

export type LoginResult = { twoFactorRequired: true; email: string } | { twoFactorRequired: false }

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  verifyTwoFactor: (email: string, code: string) => Promise<void>
  resendTwoFactorCode: (email: string) => Promise<string>
  enableTwoFactor: () => Promise<void>
  disableTwoFactor: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
