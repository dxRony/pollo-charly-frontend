import { apiFetch, clearToken, setToken } from './api'
import type {
  LoginResponse,
  MessageResponse,
  ResetPasswordPayload,
  TwoFactorStatusResponse,
  TwoFactorToggleResponse,
  User,
  VerifyTwoFactorResponse,
} from '@/types/auth'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (!response.two_factor_required) {
    setToken(response.token)
  }

  return response
}

export async function verifyTwoFactor(email: string, code: string): Promise<VerifyTwoFactorResponse> {
  const response = await apiFetch<VerifyTwoFactorResponse>('/2fa/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })

  setToken(response.token)

  return response
}

export function resendTwoFactorCode(email: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/2fa/resend', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function getTwoFactorStatus(): Promise<TwoFactorStatusResponse> {
  return apiFetch<TwoFactorStatusResponse>('/2fa/status')
}

export function enableTwoFactor(): Promise<TwoFactorToggleResponse> {
  return apiFetch<TwoFactorToggleResponse>('/2fa/enable', { method: 'POST' })
}

export function disableTwoFactor(): Promise<TwoFactorToggleResponse> {
  return apiFetch<TwoFactorToggleResponse>('/2fa/disable', { method: 'POST' })
}

export function forgotPassword(email: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/logout', { method: 'POST' })
  } finally {
    clearToken()
  }
}

export function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/me')
}
