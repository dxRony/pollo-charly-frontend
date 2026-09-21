import type { User } from './auth'

export interface PaginatedUsers {
  data: User[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface UserFilters {
  search?: string
  role_id?: number
  is_active?: boolean
  page?: number
  per_page?: number
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role_id: number
  is_active?: boolean
}

export interface UpdateUserPayload {
  name: string
  email: string
  password?: string
  role_id: number
  is_active?: boolean
}

export interface UserMutationResponse {
  message: string
  user: User
}
