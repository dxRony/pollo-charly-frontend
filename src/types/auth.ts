export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  is_active: boolean
  two_factor_enabled: boolean
  role: Role | null
  created_at?: string | null
}

export interface LoginTwoFactorRequiredResponse {
  two_factor_required: true
  message: string
  email: string
}

export interface LoginSuccessResponse {
  two_factor_required: false
  user: User
  token: string
}

export type LoginResponse = LoginTwoFactorRequiredResponse | LoginSuccessResponse

export interface VerifyTwoFactorResponse {
  message: string
  user: User
  token: string
}

export interface MessageResponse {
  message: string
}

export interface TwoFactorStatusResponse {
  two_factor_enabled: boolean
}

export interface TwoFactorToggleResponse {
  message: string
  two_factor_enabled: boolean
}
