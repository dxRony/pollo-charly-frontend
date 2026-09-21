import { apiFetch } from './api'
import type { Role } from '@/types/auth'
import type {
  CreateUserPayload,
  PaginatedUsers,
  UpdateUserPayload,
  UserFilters,
  UserMutationResponse,
} from '@/types/user'

function buildQueryString(filters: UserFilters): string {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.role_id) {
    params.set('role_id', String(filters.role_id))
  }
  if (filters.is_active !== undefined) {
    params.set('is_active', String(filters.is_active))
  }
  if (filters.page) {
    params.set('page', String(filters.page))
  }
  if (filters.per_page) {
    params.set('per_page', String(filters.per_page))
  }

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export function getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
  return apiFetch<PaginatedUsers>(`/users${buildQueryString(filters)}`)
}

export function getRoles(): Promise<Role[]> {
  return apiFetch<Role[]>('/roles')
}

export function createUser(payload: CreateUserPayload): Promise<UserMutationResponse> {
  return apiFetch<UserMutationResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateUser(id: number, payload: UpdateUserPayload): Promise<UserMutationResponse> {
  return apiFetch<UserMutationResponse>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function toggleUserStatus(id: number, isActive: boolean): Promise<UserMutationResponse> {
  return apiFetch<UserMutationResponse>(`/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  })
}
