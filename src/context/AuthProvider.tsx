import { useEffect, useState, type ReactNode } from 'react'
import * as authService from '@/services/authService'
import { SESSION_EXPIRED_EVENT, getToken } from '@/services/api'
import type { User } from '@/types/auth'
import { AuthContext, type LoginResult } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) {
      return
    }

    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const handleSessionExpired = () => setUser(null)

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

  async function login(email: string, password: string): Promise<LoginResult> {
    const response = await authService.login(email, password)

    if (response.two_factor_required) {
      return { twoFactorRequired: true, email: response.email }
    }

    setUser(response.user)
    return { twoFactorRequired: false }
  }

  async function verifyTwoFactor(email: string, code: string) {
    const response = await authService.verifyTwoFactor(email, code)
    setUser(response.user)
  }

  async function resendTwoFactorCode(email: string): Promise<string> {
    const response = await authService.resendTwoFactorCode(email)
    return response.message
  }

  async function refreshUser() {
    const freshUser = await authService.getCurrentUser()
    setUser(freshUser)
  }

  async function enableTwoFactor() {
    await authService.enableTwoFactor()
    await refreshUser()
  }

  async function disableTwoFactor() {
    await authService.disableTwoFactor()
    await refreshUser()
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        verifyTwoFactor,
        resendTwoFactorCode,
        enableTwoFactor,
        disableTwoFactor,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
