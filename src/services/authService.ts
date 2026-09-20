import { apiFetch, clearToken, setToken } from './api'
import type { LoginResponse, User } from '@/types/auth'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  setToken(response.token)

  return response
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
